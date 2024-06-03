import React, { useState } from 'react';

const LoginPage: React.FC = () => {
    const [password, setPassword] = useState('');

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        // Add your login logic here
        console.log('Logging in with password:', password);
    };

    return (
        <div className={`flex flex-col items-center justify-center h-screen`}>
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your password"
            />
            <button
                onClick={handleLogin}
                className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
                Login
            </button>
        </div>
    );
};

export default LoginPage;