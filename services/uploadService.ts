/**
 * Serviço para upload de vídeos via backend para Google Cloud Storage
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface UploadResponse {
  success: boolean;
  data?: {
    fileName: string;
    signedUrl: string;
    publicUrl: string;
    fileSize: number;
  };
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Faz upload de um vídeo para o Google Cloud Storage via backend
 * @param file Arquivo de vídeo
 * @param onProgress Callback para progresso do upload
 * @returns Promise<UploadResponse>
 */
export const uploadVideoToGCS = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('video', file);

    // Criar XMLHttpRequest para ter controle sobre o progresso
    return new Promise<UploadResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Configurar callback de progresso
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            };
            onProgress(progress);
          }
        });
      }

      // Configurar callback de conclusão
      xhr.addEventListener('load', () => {
        try {
          const response: UploadResponse = JSON.parse(xhr.responseText);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(response);
          } else {
            reject(new Error(response.error || `HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        } catch (error) {
          reject(new Error('Erro ao processar resposta do servidor'));
        }
      });

      // Configurar callback de erro
      xhr.addEventListener('error', () => {
        reject(new Error('Erro de rede durante o upload'));
      });

      // Configurar callback de timeout
      xhr.addEventListener('timeout', () => {
        reject(new Error('Timeout durante o upload'));
      });

      // Configurar e enviar requisição
      xhr.open('POST', `${API_BASE_URL}/api/upload-video`);
      xhr.timeout = 5 * 60 * 1000; // 5 minutos de timeout
      xhr.send(formData);
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
};

/**
 * Deleta um vídeo do Google Cloud Storage
 * @param fileName Nome do arquivo no GCS
 * @returns Promise<boolean>
 */
export const deleteVideoFromGCS = async (fileName: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/delete-video/${encodeURIComponent(fileName)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return result.success;

  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    throw error;
  }
};

/**
 * Verifica se o backend está funcionando
 * @returns Promise<boolean>
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      timeout: 5000,
    });

    return response.ok;

  } catch (error) {
    console.error('Backend não está respondendo:', error);
    return false;
  }
};

/**
 * Formata o tamanho do arquivo em formato legível
 * @param bytes Tamanho em bytes
 * @returns String formatada
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Estima o tempo restante de upload
 * @param loaded Bytes já enviados
 * @param total Total de bytes
 * @param startTime Timestamp do início do upload
 * @returns Tempo estimado em segundos
 */
export const estimateTimeRemaining = (
  loaded: number,
  total: number,
  startTime: number
): number => {
  const elapsed = (Date.now() - startTime) / 1000; // segundos
  const rate = loaded / elapsed; // bytes por segundo
  const remaining = total - loaded;
  
  return remaining / rate;
};

/**
 * Formata tempo em formato legível
 * @param seconds Tempo em segundos
 * @returns String formatada (ex: "2m 30s")
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  
  return `${minutes}m ${remainingSeconds}s`;
};
