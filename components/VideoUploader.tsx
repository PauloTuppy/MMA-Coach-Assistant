
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MAX_FILE_SIZE } from '../constants';

interface VideoUploaderProps {
    label: string;
    onFileUpload: (file: File | null) => void;
    file: File | null;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ label, onFileUpload, file }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setVideoPreviewUrl(null);
        }
    }, [file]);
    
    const handleFile = useCallback((selectedFile: File) => {
        setError(null);
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('video/')) {
            setError('Invalid file type. Please upload a video.');
            onFileUpload(null);
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError(`File is too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
            onFileUpload(null);
            return;
        }
        
        onFileUpload(selectedFile);
    }, [onFileUpload]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };
    
    const handleRemoveVideo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onFileUpload(null);
        setError(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div
                onClick={handleClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                {file ? (
                     <div className="flex flex-col items-center">
                        <span className="text-5xl" role="img" aria-label="check mark">✅</span>
                        <p className="mt-2 font-semibold text-gray-700 break-all">{file.name}</p>
                        <p className="text-sm text-gray-500">Click or drag to replace</p>
                     </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <span className="text-5xl text-blue-500" role="img" aria-label="folder">📁</span>
                        <p className="mt-2 font-semibold text-gray-700">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-500">MP4, MOV, AVI, etc. (Max 50MB)</p>
                    </div>
                )}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {videoPreviewUrl && (
                <div className="mt-4 relative">
                    <video src={videoPreviewUrl} controls className="w-full rounded-lg shadow-inner"></video>
                    <button onClick={handleRemoveVideo} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-opacity-75">&times;</button>
                </div>
            )}
        </div>
    );
};