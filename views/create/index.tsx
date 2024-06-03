import React, { useEffect, useState } from 'react';

const CreateWalletPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        setShowError(false);
    }, [password, confirmPassword]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setShowError(true);        
        } else {
            console.log('Wallet created!');
        }
    };

    return (
        <div className='flex flex-col h-screen justify-center'>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                />
                {showError && <p>Passwords do not match!</p>}
                <button 
                    type="submit" 
                    className="w-full px-6 py-2 text-lg text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                >
                    Create Wallet
                </button>
            </form>  
        </div>
    )
};

export default CreateWalletPage;