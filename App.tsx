import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { CartModal } from './components/CartModal';
import { ProfilePage } from './pages/ProfilePage';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { Product, CartItem, FighterProfile } from './types';
import { products as initialProducts } from './constants';

type Page = 'coach' | 'store' | 'profile';

const App: React.FC = () => {
    const [products] = useState<Product[]>(initialProducts);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('coach');
    const [fighterProfile, setFighterProfile] = useState<FighterProfile | null>(null);

     // Effect for handling hash-based routing
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace(/^#\/?/, '') || 'coach';
            setCurrentPage(hash as Page);
        };
        
        window.addEventListener('hashchange', handleHashChange, false);
        handleHashChange(); // Set initial page

        return () => {
            window.removeEventListener('hashchange', handleHashChange, false);
        };
    }, []);

    // Effect for loading fighter profile from localStorage
    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('fighterProfile');
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                setFighterProfile(profile);
            }
        } catch (error) {
            console.error("Failed to load profile from localStorage", error);
        }
        // Re-check profile when page changes, e.g., after saving on profile page and coming back
    }, [currentPage]);

    const addToCart = useCallback((product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        alert(`Added ${product.name} to cart!`);
    }, []);

    const removeFromCart = (productId: number) => {
        setCart(cart => cart.filter(item => item.id !== productId));
    };

    const updateCartQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(cart =>
                cart.map(item =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const handleNavigate = (page: Page) => {
        window.location.hash = `#/${page}`;
    };

    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
    const storeName = fighterProfile?.name || 'Fighter';

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
                <Header
                    page={currentPage}
                    onNavigate={handleNavigate}
                    cartItemCount={cartItemCount}
                    storeName={storeName}
                    onCartClick={() => setIsCartOpen(true)}
                />
                {currentPage === 'coach' &&
                    <HomePage
                        fighterProfile={fighterProfile}
                    />
                }
                {currentPage === 'store' &&
                    <StorePage
                        products={products}
                        cart={cart}
                        onAddToCart={addToCart}
                        storeName={storeName}
                    />
                }
                {currentPage === 'profile' &&
                    <ProfilePage />
                }
                <CartModal
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    cartItems={cart}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateCartQuantity}
                />
            </div>
        </ErrorBoundary>
    );
};

export default App;