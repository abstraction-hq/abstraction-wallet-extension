import { Address } from "viem";

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

export interface IConfigStoreState {
    activeNetwork: string
    onSetActiveNetwork: (network: string) => void
}

export interface IDapp {
    id: number
    name: string
    url: string
    icon: string
    description: string
}

export interface IDappStoreState {
    dapps: Record<string, IDapp>
}
