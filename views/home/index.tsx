import { Account } from '~crypto/account';
import { useUserStore, useWalletStore } from '~stores';
import React, { useEffect, useRef } from 'react';

const HomePage: React.FC = () => {
    const activeWallet: number = useWalletStore((state) => state.activeWallet)
    const wallets = useWalletStore((state) => state.wallets)
    const credentials = useUserStore((state) => state.credentials)

    const account = useRef<Account>()

    const initAccount = async () => {
    }

    useEffect(() => {
        initAccount()
    }, [activeWallet, credentials])

    return (
        <div className="flex flex-col items-center">
        <h1 className="mb-4">Home Page</h1>
        <div className="rounded-lg p-4 shadow">
            <p className="mb-2">Wallet Name: {wallets[activeWallet]?.name}</p>
            <div className="flex items-center mb-2">
                <p className="mr-2">Address: {wallets[activeWallet]?.senderAddress}</p>
            </div>
            <div className="flex items-center mb-2">
                <p className="mr-2">Signer Address: {wallets[activeWallet]?.signerAddress}</p>
            </div>
            <p className="mb-2">Balance: {0} VIC</p>
            <div className="flex mt-4">
            <button className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Send Token</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded">Receive Token</button>
            </div>
        </div>
        </div>
    );
};

export default HomePage;