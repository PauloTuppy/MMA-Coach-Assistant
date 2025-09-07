
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <div 
            className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]}`}
            style={{ borderColor: '#fff', borderTopColor: 'transparent' }}
            role="status"
            aria-live="polite"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};
