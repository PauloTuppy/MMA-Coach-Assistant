import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config } from 'dotenv';
import { uploadVideoToGCS, ensureBucketExists, deleteVideoFromGCS } from '../services/gcsService';
import { FILE_UPLOAD } from '../constants';

// Carregar variáveis de ambiente
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] // Substitua pelo seu domínio em produção
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));

// Configuração do Multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE_BYTES, // 50MB
  },
  fileFilter: (req, file, cb) => {
    // Validar tipo de arquivo
    if (FILE_UPLOAD.ACCEPTED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de arquivo não suportado: ${file.mimetype}`));
    }
  },
});

// Interface para resposta de upload
interface UploadVideoResponse {
  success: boolean;
  data?: {
    fileName: string;
    signedUrl: string;
    publicUrl: string;
    fileSize: number;
  };
  error?: string;
}

// Endpoint para upload de vídeo
app.post('/api/upload-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo foi enviado',
      } as UploadVideoResponse);
    }

    const { originalname, mimetype, buffer } = req.file;

    // Validações adicionais
    if (buffer.length > FILE_UPLOAD.MAX_SIZE_BYTES) {
      return res.status(413).json({
        success: false,
        error: `Arquivo muito grande. Máximo permitido: ${FILE_UPLOAD.MAX_SIZE_MB}MB`,
      } as UploadVideoResponse);
    }

    console.log(`Iniciando upload: ${originalname} (${(buffer.length / 1024 / 1024).toFixed(2)}MB)`);

    // Fazer upload para Google Cloud Storage
    const uploadResult = await uploadVideoToGCS(buffer, originalname, mimetype);

    console.log(`Upload concluído com sucesso: ${uploadResult.fileName}`);

    res.json({
      success: true,
      data: uploadResult,
    } as UploadVideoResponse);

  } catch (error) {
    console.error('Erro no upload:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
    } as UploadVideoResponse);
  }
});

// Endpoint para deletar vídeo
app.delete('/api/delete-video/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    
    if (!fileName) {
      return res.status(400).json({
        success: false,
        error: 'Nome do arquivo é obrigatório',
      });
    }

    await deleteVideoFromGCS(fileName);

    res.json({
      success: true,
      message: 'Arquivo deletado com sucesso',
    });

  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

// Endpoint de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Middleware de tratamento de erros
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: `Arquivo muito grande. Máximo permitido: ${FILE_UPLOAD.MAX_SIZE_MB}MB`,
      });
    }
  }
  
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Verificar se o bucket existe
    await ensureBucketExists();
    console.log('Google Cloud Storage configurado com sucesso');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📁 Bucket GCS: ${process.env.GOOGLE_CLOUD_BUCKET_NAME}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
    
  } catch (error) {
    console.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

startServer();
