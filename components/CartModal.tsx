import React from 'react';
import type { CartItem } from '../types';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onRemove: (productId: number) => void;
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, onRemove, onUpdateQuantity }) => {
    if (!isOpen) return null;

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            alert(`Checkout initiated for ${cartItems.length} items with a total of ${formatPrice(subtotal)}!`);
            onClose();
        } else {
            alert("Your cart is empty.");
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex justify-end"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div 
                className="bg-gray-900 border-l border-gray-700 w-full max-w-md h-full flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold uppercase">Your Cart</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl" aria-label="Close cart">&times;</button>
                </div>

                {/* Cart Items */}
                {cartItems.length > 0 ? (
                    <div className="flex-grow p-4 overflow-y-auto">
                        <ul className="space-y-4">
                            {cartItems.map(item => (
                                <li key={item.id} className="flex items-center gap-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-semibold truncate">{item.name}</h3>
                                        <p className="text-sm text-gray-400">{formatPrice(item.price)}</p>
                                        <div className="flex items-center mt-2">
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 bg-gray-700 rounded">-</button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-gray-700 rounded">+</button>
                                        </div>
                                    </div>
                                    <button onClick={() => onRemove(item.id)} className="text-gray-500 hover:text-red-500" aria-label={`Remove ${item.name}`}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                        <i className="fa-solid fa-cart-shopping text-5xl text-gray-600 mb-4"></i>
                        <h3 className="text-xl font-semibold">Your cart is empty</h3>
                        <p className="text-gray-400 mt-1">Looks like you haven't added anything yet.</p>
                    </div>
                )}


                {/* Footer */}
                <div className="p-4 border-t border-gray-700 flex-shrink-0 space-y-4">
                     <div className="flex justify-between font-semibold">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Shipping & taxes calculated at checkout.</p>
                    <button
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                        className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};