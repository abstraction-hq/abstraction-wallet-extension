import { Address, createPublicClient, Hex, http, PublicClient } from "viem"

import {
    ACTIVE_WALLET,
    ENCRYPTED_MNEMONIC,
    ExtensionStorage,
    PASSWORD_HASH,
    WALLET_LIST
} from "~storage"

import { IStoredWallet } from "./types"
import { decryptMnemonic, encryptMnemonic, hashPassword } from "./encryption"
import { AccountService } from "~account"
import { NETWORKS } from "~constants"
import { mnemonicToAccount } from "viem/accounts"

const setWalletList = async (wallets: IStoredWallet[]) => {
    await ExtensionStorage.set(WALLET_LIST, wallets)
}

const setActiveWallet = async (wallet: IStoredWallet) => {
    await ExtensionStorage.set(ACTIVE_WALLET, wallet)
}

const setEncryptedMnemonic = async (encryptedMnemonic: string) => {
    await ExtensionStorage.set(ENCRYPTED_MNEMONIC, encryptedMnemonic)
}

const setPassword = async (passwordHash: string) => {
    await ExtensionStorage.set(PASSWORD_HASH, passwordHash)
}

export const initWallet = async (mnemonic: string, password: string) => {
    const ethClient = createPublicClient({
        chain: NETWORKS["testnet"],
        transport: http()
    })
    const signer = mnemonicToAccount(mnemonic)
    const account = new AccountService(signer, ethClient as PublicClient)

    const sender = await account.getSender()

    const storeWallet: IStoredWallet = {
        index: 0,
        address: sender
    }

    await setWalletList([storeWallet])
    await setActiveWallet(storeWallet)

    const encryptedMnemonic: string = await encryptMnemonic(
        mnemonic,
        password
    )
    await setEncryptedMnemonic(encryptedMnemonic)

    const passwordHash: Hex = hashPassword(password)
    await setPassword(passwordHash)
}

export const getWallets = async (): Promise<IStoredWallet[]> => {
    const wallets: IStoredWallet[] | undefined =
        await ExtensionStorage.get(WALLET_LIST)

    return wallets || []
}

export const getActiveWallet = async (): Promise<IStoredWallet | null> => {
    const activeWallet: IStoredWallet | undefined =
        await ExtensionStorage.get(ACTIVE_WALLET)

    return activeWallet || null
}

export const getMnemonic = async (password: string): Promise<string> => {
    const encryptedMnemonic: string | undefined =
        await ExtensionStorage.get(ENCRYPTED_MNEMONIC)
    let mnemonic = ""
    if (encryptedMnemonic) {
        mnemonic = await decryptMnemonic(encryptedMnemonic, password)
    }
    return mnemonic
}

export const checkPassword = async (password: string): Promise<boolean> => {
    const passwordHash = hashPassword(password)
    const passwordHashStored = await ExtensionStorage.get(PASSWORD_HASH)

    return passwordHash == passwordHashStored
}

export const storeMnemonic = async (mnemonic: string) => {
    await ExtensionStorage.set(ENCRYPTED_MNEMONIC, mnemonic)
}

export const storePassword = async (password: string) => {
    await ExtensionStorage.set(ENCRYPTED_MNEMONIC, password)
}

export const addWallet = async (address: Address)  => {
}
