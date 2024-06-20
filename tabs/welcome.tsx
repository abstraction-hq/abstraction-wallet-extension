import React from 'react';

import "~style.css";

const WelcomeView: React.FC = () => {

    const handleCreateWallet = () => {
        // navigator("/create")
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-4 text-3xl font-bold">Welcome to Abstraction Wallet</h1>
            <button 
                onClick={handleCreateWallet} 
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
                Create Wallet
            </button>
        </div>
    );
};

export default WelcomeView;