import React from 'react';

const HomePage: React.FC = () => {
    const address = '0x1234567890abcdef';
    const balance = 100.5;

    return (
        <div className="items-center justify-center h-screen">
            <h1 className="mb-4">Home Page</h1>
            <div className="rounded-lg">
                <p className="">Address: {address}</p>
                <p className="">Balance: {balance} VIC</p>
            </div>
        </div>
    );
};

export default HomePage;