import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { Spinner } from './Spinner';
import { getRecommendationsFromImage } from '../services/geminiService';
import type { Product } from '../types';

interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    onAddToCart: (product: Product) => void;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, products, onAddToCart }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState<string>('Find an outfit that matches this style for me.');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [recommendationReasons, setRecommendationReasons] = useState<Record<number, string>>({});

    const handleGetRecommendations = async () => {
        if (!imageFile) {
            setError('Please upload an image first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setRecommendations([]);
        setRecommendationReasons({});

        try {
             const base64EncodedData = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(imageFile);
            });

            const result = await getRecommendationsFromImage(base64EncodedData, imageFile.type, prompt, products);

            const foundProducts = result.map(rec => {
                const product = products.find(p => p.name.toLowerCase() === rec.productName.toLowerCase());
                return product ? { ...product, reason: rec.reason } : null;
            }).filter((p): p is Product & { reason: string } => p !== null);


            if (foundProducts.length === 0) {
                setError("I couldn't find any matching products from our collection. Try a different image or prompt!");
            } else {
                setRecommendations(foundProducts);
                const reasons = foundProducts.reduce((acc, p) => {
                    acc[p.id] = p.reason;
                    return acc;
                }, {} as Record<number, string>);
                setRecommendationReasons(reasons);
            }

        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={handleClose} style={{ backdropFilter: 'blur(4px)' }}>
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center"><i className="fa-solid fa-wand-magic-sparkles text-red-500 mr-3"></i> AI Shopping Assistant</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="p-6 flex-grow overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Side: Inputs */}
                    <div className="space-y-4 flex flex-col">
                        <ImageUploader onImageUpload={setImageFile} />
                        <div className="flex-grow">
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">What are you looking for?</label>
                            <textarea
                                id="prompt"
                                rows={3}
                                className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleGetRecommendations}
                            disabled={!imageFile || isLoading}
                            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? 'Thinking...' : 'Get Recommendations'}
                        </button>
                    </div>
                    
                    {/* Right Side: Results */}
                    <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col min-h-[400px]">
                        <h3 className="font-semibold mb-4 text-center text-gray-300 flex-shrink-0">Our Suggestions</h3>
                        <div className="flex-grow overflow-y-auto pr-2">
                             {isLoading && <div className="flex items-center justify-center h-full"><Spinner /></div>}
                             {error && <div className="flex items-center justify-center h-full"><p className="text-center text-red-400 px-4">{error}</p></div>}
                             {!isLoading && !error && recommendations.length === 0 && (
                                <div className="flex items-center justify-center h-full"><p className="text-center text-gray-500">Your personalized recommendations will appear here.</p></div>
                             )}
                            {recommendations.length > 0 && (
                                <div className="space-y-4">
                                    {recommendations.map(product => (
                                    <div key={product.id} className="bg-gray-900/50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-300 mb-2 italic">"<i className="fa-solid fa-quote-left fa-xs mr-1"></i>{recommendationReasons[product.id]}<i className="fa-solid fa-quote-right fa-xs ml-1"></i>"</p>
                                            <div className="flex items-center gap-4">
                                                <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0"/>
                                                <div className="flex-grow min-w-0">
                                                    <h4 className="font-semibold truncate">{product.name}</h4>
                                                    <p className="text-red-500 font-bold">{formatPrice(product.price)}</p>
                                                </div>
                                                <button onClick={() => { onAddToCart(product); onClose(); }} title="Add to Cart" className="bg-red-600 text-white font-bold p-2 rounded-md hover:bg-red-700 text-sm h-10 w-10 flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-plus"></i></button>
                                            </div>
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
