import { ACTIVE_WALLET, ENCRYPTED_MNEMONIC, ExtensionStorage, WALLET_LIST } from "~storage";
import { IStoredWallet } from "./types";
import { Address } from "viem";

export const getWallets = async (): Promise<IStoredWallet[]>  => {
    const wallets: IStoredWallet[] | undefined = await ExtensionStorage.get(WALLET_LIST) 

    return wallets || []
}

export const getActiveWallet = async (): Promise<Address | null> => {
    const activeWallet: Address | undefined = await ExtensionStorage.get(ACTIVE_WALLET)
    
    return activeWallet || null
}

export const getMnemonic = async (password: string): Promise<string> => {
    const mnemonic: string | undefined = await ExtensionStorage.get(ENCRYPTED_MNEMONIC)
    return mnemonic || ""
}

export const checkPassword = async (password: string): Promise<boolean> => {
    return true
}

export const setMnemonic = async (mnemonic: string) => {
    await ExtensionStorage.set(ENCRYPTED_MNEMONIC, mnemonic)
}