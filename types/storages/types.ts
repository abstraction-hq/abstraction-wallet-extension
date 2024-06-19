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
    hostname: string
    name: string
    icon: string
}

export interface IDappStoreState {
    dappInfos: Record<string, IDapp>,
    dappPermissions: Record<string, string[]>,
    onAddPermission: (hostname: string, info: IDapp, permissions: string[]) => void
    onRemovePermission: (hostname: string) => void
}
