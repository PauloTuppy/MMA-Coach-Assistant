import React, { useState, useCallback, useRef } from 'react';

interface ImageUploaderProps {
    onImageUpload: (file: File | null) => void;
    maxSizeMb?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, maxSizeMb = 5 }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback((file: File) => {
        setError(null);
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file.');
            onImageUpload(null);
            return;
        }
        if (file.size > maxSizeMb * 1024 * 1024) {
            setError(`File size cannot exceed ${maxSizeMb}MB.`);
            onImageUpload(null);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageUpload(file);
    }, [onImageUpload, maxSizeMb]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };
    
    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setPreview(null);
        setError(null);
        onImageUpload(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div className="w-full">
            <div
                className="relative border-2 border-dashed border-gray-500 rounded-lg p-6 text-center hover:border-red-500 transition-colors bg-gray-800/50"
            >
                <input id="image-upload" ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleChange} />
                {preview ? (
                    <>
                        <img src={preview} alt="Image Preview" className="mx-auto max-h-40 rounded-md" />
                         <button onClick={removeImage} title="Remove image" className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full h-6 w-6 flex items-center justify-center leading-none text-lg font-bold">&times;</button>
                         <label htmlFor="image-upload" className="cursor-pointer text-sm text-red-400 hover:underline mt-2 block">Change image</label>
                    </>
                ) : (
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                        <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                        <span className="font-semibold text-gray-200">Upload an Image</span>
                        <span className="text-sm text-gray-400 mt-1">to get personalized recommendations</span>
                    </label>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};
