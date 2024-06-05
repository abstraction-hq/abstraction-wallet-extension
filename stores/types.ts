import { Address, Hex } from "viem";

export interface IWallet {
    id: number
    name: string
    senderAddress: Address
    signerAddress: Address
}

export interface IWalletStoreState {
    activeWallet: number
    wallets: IWallet[]
    onCreateWallet: (wallet: IWallet) => void
    setActiveWallet: (id: number) => void
}

export interface IUserCredentials {
    password?: string;
    encryptedMnemonic?: string
}

export interface IUserStoreState {
    credentials?: IUserCredentials;
    onSetCredentials: (credentials: IUserCredentials) => void;
}

export interface ICacheStoreState {
    cachePassword?: string;
    onInitCache: (password: string) => void;
}