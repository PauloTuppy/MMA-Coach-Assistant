import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20 transform hover:-translate-y-2">
            <div className="relative overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="p-4 flex flex-col">
                <h3 className="text-lg font-semibold text-white truncate h-7">{product.name}</h3>
                <p className="text-xl font-bold text-red-500 mt-2">{formatPrice(product.price)}</p>
                <button
                    onClick={() => onAddToCart(product)}
                    className="mt-4 w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};