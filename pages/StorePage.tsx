import React, { useState, useMemo } from 'react';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { AIAssistant } from '../components/AIAssistant';
import type { Product, CartItem } from '../types';

interface StorePageProps {
    products: Product[];
    cart: CartItem[];
    onAddToCart: (product: Product) => void;
    storeName: string;
}

export const StorePage: React.FC<StorePageProps> = ({ products, onAddToCart, storeName }) => {
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortOrder, setSortOrder] = useState<string>('default');

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const displayedProducts = useMemo(() => {
        let filteredProducts = products;

        if (selectedCategory !== 'All') {
            filteredProducts = products.filter(p => p.category === selectedCategory);
        }

        const sortedProducts = [...filteredProducts];
        if (sortOrder === 'price-asc') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            sortedProducts.sort((a, b) => b.price - a.price);
        }

        return sortedProducts;
    }, [products, selectedCategory, sortOrder]);

    return (
        <>
            <main className="flex-grow">
                <HeroSection storeName={storeName} />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-3xl font-bold tracking-tight text-center mb-10 uppercase">
                        Featured Collection
                    </h2>

                    {/* Filter and Sort Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        {/* Category Filters */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                                        selectedCategory === category
                                            ? 'bg-red-600 text-white shadow-md'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div>
                             <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                                aria-label="Sort products"
                             >
                                <option value="default">Sort by Feature</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {displayedProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAddToCart={() => onAddToCart(product)} 
                            />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />

            <button
                onClick={() => setIsAiAssistantOpen(true)}
                className="fixed bottom-6 right-6 bg-red-600 text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg hover:bg-red-700 transition-transform transform hover:scale-110 z-40"
                aria-label="Open AI Shopping Assistant"
                title="AI Shopping Assistant"
            >
                <i className="fa-solid fa-wand-magic-sparkles fa-xl"></i>
            </button>

            <AIAssistant 
                isOpen={isAiAssistantOpen}
                onClose={() => setIsAiAssistantOpen(false)}
                products={products}
                onAddToCart={onAddToCart}
            />
        </>
    );
};