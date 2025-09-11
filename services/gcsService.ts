import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

// Configuração do Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || 'mma-coach-videos';

/**
 * Interface para resposta de upload
 */
export interface UploadResponse {
  fileName: string;
  signedUrl: string;
  publicUrl: string;
  fileSize: number;
}

/**
 * Faz upload de um arquivo para o Google Cloud Storage
 * @param file Buffer do arquivo
 * @param originalName Nome original do arquivo
 * @param mimeType Tipo MIME do arquivo
 * @returns Promise<UploadResponse>
 */
export const uploadVideoToGCS = async (
  file: Buffer,
  originalName: string,
  mimeType: string
): Promise<UploadResponse> => {
  try {
    // Gerar nome único para o arquivo
    const fileExtension = originalName.split('.').pop() || 'mp4';
    const fileName = `videos/${uuidv4()}.${fileExtension}`;
    
    // Referência ao bucket e arquivo
    const bucket = storage.bucket(bucketName);
    const fileRef = bucket.file(fileName);
    
    // Configurações de upload
    const uploadOptions = {
      metadata: {
        contentType: mimeType,
        metadata: {
          originalName,
          uploadedAt: new Date().toISOString(),
        },
      },
      resumable: true, // Importante para arquivos grandes
      validation: 'crc32c', // Validação de integridade
    };
    
    // Fazer upload do arquivo
    await fileRef.save(file, uploadOptions);
    
    console.log(`Upload concluído: ${fileName}`);
    
    // Gerar URL assinada (válida por 1 hora)
    const signedUrl = await generateSignedUrl(fileName);
    
    // URL pública (para referência, mas o bucket deve ser privado)
    const publicUrl = `gs://${bucketName}/${fileName}`;
    
    return {
      fileName,
      signedUrl,
      publicUrl,
      fileSize: file.length,
    };
    
  } catch (error) {
    console.error('Erro no upload para GCS:', error);
    throw new Error(`Falha no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

/**
 * Gera uma URL assinada para acesso temporário ao arquivo
 * @param fileName Nome do arquivo no GCS
 * @param expirationMinutes Tempo de expiração em minutos (padrão: 60)
 * @returns Promise<string>
 */
export const generateSignedUrl = async (
  fileName: string,
  expirationMinutes: number = 60
): Promise<string> => {
  try {
    const options = {
      version: 'v4' as const,
      action: 'read' as const,
      expires: Date.now() + expirationMinutes * 60 * 1000,
    };
    
    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);
    
    return url;
    
  } catch (error) {
    console.error('Erro ao gerar URL assinada:', error);
    throw new Error(`Falha ao gerar URL assinada: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

/**
 * Deleta um arquivo do Google Cloud Storage
 * @param fileName Nome do arquivo no GCS
 * @returns Promise<void>
 */
export const deleteVideoFromGCS = async (fileName: string): Promise<void> => {
  try {
    await storage.bucket(bucketName).file(fileName).delete();
    console.log(`Arquivo deletado: ${fileName}`);
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    throw new Error(`Falha ao deletar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

/**
 * Verifica se o bucket existe e cria se necessário
 * @returns Promise<void>
 */
export const ensureBucketExists = async (): Promise<void> => {
  try {
    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();
    
    if (!exists) {
      console.log(`Criando bucket: ${bucketName}`);
      await storage.createBucket(bucketName, {
        location: 'US-WEST1', // Ajuste conforme necessário
        storageClass: 'STANDARD',
        uniformBucketLevelAccess: true,
      });
      console.log(`Bucket criado: ${bucketName}`);
    }
  } catch (error) {
    console.error('Erro ao verificar/criar bucket:', error);
    throw new Error(`Falha ao configurar bucket: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

/**
 * Lista arquivos no bucket (para debug/administração)
 * @param prefix Prefixo para filtrar arquivos
 * @returns Promise<string[]>
 */
export const listFiles = async (prefix: string = 'videos/'): Promise<string[]> => {
  try {
    const [files] = await storage.bucket(bucketName).getFiles({ prefix });
    return files.map(file => file.name);
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    throw new Error(`Falha ao listar arquivos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};
