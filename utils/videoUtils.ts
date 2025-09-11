import { VIDEO_PROCESSING } from '../constants';

/**
 * Compresses a video file to reduce its size for API upload
 * @param file The original video file
 * @param quality Compression quality (0-1, default 0.8)
 * @returns Promise<File> The compressed video file
 */
export const compressVideo = async (file: File, quality: number = VIDEO_PROCESSING.COMPRESSION_QUALITY): Promise<File> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        video.onloadedmetadata = () => {
            // Set canvas dimensions (reduce resolution for compression)
            const maxWidth = 1280;
            const maxHeight = 720;
            
            let { videoWidth, videoHeight } = video;
            
            // Calculate new dimensions maintaining aspect ratio
            if (videoWidth > maxWidth || videoHeight > maxHeight) {
                const aspectRatio = videoWidth / videoHeight;
                if (videoWidth > videoHeight) {
                    videoWidth = maxWidth;
                    videoHeight = maxWidth / aspectRatio;
                } else {
                    videoHeight = maxHeight;
                    videoWidth = maxHeight * aspectRatio;
                }
            }
            
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            
            // Create a MediaRecorder to record the compressed video
            const stream = canvas.captureStream(30); // 30 FPS
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 1000000 * quality // Adjust bitrate based on quality
            });
            
            const chunks: Blob[] = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const compressedBlob = new Blob(chunks, { type: 'video/webm' });
                const compressedFile = new File([compressedBlob], 
                    file.name.replace(/\.[^/.]+$/, '.webm'), 
                    { type: 'video/webm' }
                );
                resolve(compressedFile);
            };
            
            // Start recording
            mediaRecorder.start();
            
            // Draw video frames to canvas
            const drawFrame = () => {
                if (video.ended || video.paused) {
                    mediaRecorder.stop();
                    return;
                }
                
                ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
                requestAnimationFrame(drawFrame);
            };
            
            video.play();
            drawFrame();
        };
        
        video.onerror = () => {
            reject(new Error('Error loading video for compression'));
        };
        
        video.src = URL.createObjectURL(file);
    });
};

/**
 * Gets video duration in seconds
 * @param file The video file
 * @returns Promise<number> Duration in seconds
 */
export const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        
        video.onloadedmetadata = () => {
            resolve(video.duration);
            URL.revokeObjectURL(video.src);
        };
        
        video.onerror = () => {
            reject(new Error('Error loading video metadata'));
            URL.revokeObjectURL(video.src);
        };
        
        video.src = URL.createObjectURL(file);
    });
};

/**
 * Validates video duration
 * @param file The video file
 * @returns Promise<string | null> Error message or null if valid
 */
export const validateVideoDuration = async (file: File): Promise<string | null> => {
    try {
        const duration = await getVideoDuration(file);
        const durationMinutes = duration / 60;
        
        if (durationMinutes > VIDEO_PROCESSING.MAX_DURATION_MINUTES) {
            return `Video duration must be less than ${VIDEO_PROCESSING.MAX_DURATION_MINUTES} minutes. Current duration: ${Math.round(durationMinutes * 10) / 10} minutes.`;
        }
        
        return null;
    } catch (error) {
        return 'Unable to validate video duration. Please ensure the file is a valid video.';
    }
};

/**
 * Formats duration in seconds to MM:SS format
 * @param seconds Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
