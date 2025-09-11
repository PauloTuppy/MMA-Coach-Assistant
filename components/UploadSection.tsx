import React, { useCallback, useRef, useState } from 'react';
import { FILE_UPLOAD } from '../constants';

interface UploadSectionProps {
    onFileSelect: (file: File) => void;
    disabled: boolean;
    progress: number;
    selectedFile: File | null;
    backendAvailable?: boolean;
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const validateFile = (file: File): string | null => {
    // Check file type
    if (!FILE_UPLOAD.ACCEPTED_TYPES.includes(file.type)) {
        return `Please select a supported video file. Accepted formats: ${FILE_UPLOAD.ACCEPTED_EXTENSIONS.join(', ')}`;
    }

    // Check file size
    if (file.size > FILE_UPLOAD.MAX_SIZE_BYTES) {
        return `File size must be less than ${FILE_UPLOAD.MAX_SIZE_MB}MB. Current size: ${formatFileSize(file.size)}`;
    }

    return null; // File is valid
};

export const UploadSection: React.FC<UploadSectionProps> = ({
    onFileSelect,
    disabled,
    progress,
    selectedFile,
    backendAvailable = true
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File | undefined) => {
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            alert(validationError);
            return;
        }

        onFileSelect(file);
    }, [onFileSelect]);


    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled) setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!disabled) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.value = ""; // Allow re-selecting the same file
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0]);
    };

    const dragOverClasses = isDragOver ? 'border-red-500 bg-gray-800' : 'border-gray-600';

    return (
        <div 
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${disabled ? 'cursor-not-allowed bg-gray-800/50' : 'cursor-pointer hover:border-red-500'} ${dragOverClasses}`}
        >
            <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="video/*"
                onChange={handleFileChange}
                disabled={disabled}
            />
            {selectedFile && !disabled ? (
                <>
                    <i className="fa-solid fa-circle-check text-5xl text-green-500 mx-auto mb-4"></i>
                    <p className="text-gray-100 font-medium">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                    <p className="text-red-500 text-sm mt-2">Click to select a different file</p>
                </>
            ) : selectedFile && disabled ? (
                 <>
                    <i className="fa-solid fa-cogs text-5xl text-red-500 mx-auto mb-4 animate-spin"></i>
                    <p className="text-gray-100 font-medium">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                        <div className="bg-red-600 h-2.5 rounded-full transition-all duration-150" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-gray-300 text-sm mt-2">
                        {progress < 100 ? `Preparing video... ${Math.round(progress)}%` : 'Sending to AI for analysis...'}
                    </p>
                </>
            ) : (
                <>
                    <i className="fa-solid fa-cloud-arrow-up text-5xl text-gray-500 mx-auto mb-4"></i>
                    <p className="text-gray-300 mb-2">Drag and drop your fight video here</p>
                    <p className="text-gray-500 text-sm mb-4">or</p>
                    <button 
                        type="button" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                        className="px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                    >
                        Select From Device
                    </button>
                    <p className="text-gray-500 text-sm mt-4">
                        Supported formats: {FILE_UPLOAD.ACCEPTED_EXTENSIONS.join(', ')} (Max {FILE_UPLOAD.MAX_SIZE_MB}MB)
                    </p>
                    {!backendAvailable && (
                        <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-700 rounded text-yellow-300 text-xs">
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            Backend offline - using base64 method (slower for large files)
                        </div>
                    )}
                    {backendAvailable && selectedFile && selectedFile.size > FILE_UPLOAD.GCS_THRESHOLD_BYTES && (
                        <div className="mt-2 p-2 bg-green-900/50 border border-green-700 rounded text-green-300 text-xs">
                            <i className="fas fa-cloud-upload-alt mr-1"></i>
                            Large file detected (>{FILE_UPLOAD.GCS_THRESHOLD_MB}MB) - will use optimized GCS upload
                        </div>
                    )}
                </>
            )}
        </div>
    );
};