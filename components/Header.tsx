import React from 'react';

type Page = 'coach' | 'store' | 'profile';

interface HeaderProps {
    cartItemCount: number;
    page: Page;
    onNavigate: (page: Page) => void;
    storeName: string;
    onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, page, onNavigate, storeName, onCartClick }) => {
    return (
        <header className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
            {page === 'store' && (
                 <div className="bg-red-600 text-center py-1.5 text-xs font-semibold">
                    <p>FREE SHIPPING ON ORDERS OVER $50</p>
                </div>
            )}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 border-b border-gray-700">
                    {/* Left Side */}
                    <div className="flex-shrink-0">
                        {page === 'coach' ? (
                             <h1 className="text-xl font-bold tracking-wider uppercase">
                                MMA Coach Assistant
                            </h1>
                        ) : (
                             <button onClick={() => onNavigate('coach')} className="text-sm font-medium hover:text-red-500 transition-colors flex items-center">
                                <i className="fa-solid fa-arrow-left mr-2"></i> Back to Coach
                            </button>
                        )}
                    </div>

                    {/* Center (Store Name / Page Title) */}
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="text-2xl font-bold tracking-wider uppercase">
                           {page === 'store' && storeName}
                           {page === 'profile' && 'Fighter Profile'}
                        </h1>
                    </div>

                    {/* Right Side */}
                    {page === 'coach' ? (
                        <button 
                            onClick={() => onNavigate('store')} 
                            className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 text-sm"
                        >
                            Official {storeName} Store <i className="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                    ) : page === 'store' ? (
                         <div className="flex items-center space-x-5">
                            <nav className="hidden md:flex md:items-center md:space-x-8 mr-4">
                                <a href="#" className="text-sm font-medium hover:text-red-500 transition-colors">APPAREL</a>
                                <a href="#" className="text-sm font-medium hover:text-red-500 transition-colors">COLLECTIBLES</a>
                            </nav>
                            <button aria-label="Search" className="hover:text-red-500 transition-colors">
                               <i className="fa-solid fa-magnifying-glass fa-lg"></i>
                            </button>
                            <button aria-label="My Account" className="hover:text-red-500 transition-colors">
                               <i className="fa-solid fa-user fa-lg"></i>
                            </button>
                            <button onClick={onCartClick} aria-label="Shopping Cart" className="relative hover:text-red-500 transition-colors">
                               <i className="fa-solid fa-cart-shopping fa-lg"></i>
                               {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2.5 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                               )}
                            </button>
                        </div>
                    ) : null }
                </div>
            </div>
        </header>
    );
};