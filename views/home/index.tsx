import { useWalletStore } from '@/store';
import React from 'react';

const HomePage: React.FC = () => {
    const activeWallet: number = useWalletStore((state) => state.activeWallet)
    const wallets = useWalletStore((state) => state.wallets)

    return (
        <div className="items-center justify-center h-screen">
            <h1 className="mb-4">Home Page</h1>
            <div className="rounded-lg">
                <p className="">Wallet Name: {wallets[activeWallet]?.name}</p>
                <p className="">Address: {wallets[activeWallet]?.address}</p>
                <p className="">Balance: {0} VIC</p>
            </div>
        </div>
    );
};

export default HomePage;