import React from 'react';

export const Spinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
        </div>
    );
};
