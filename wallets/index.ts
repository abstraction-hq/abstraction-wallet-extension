import { Address, createPublicClient, Hex, http, PublicClient } from "viem"

import {
    ACTIVE_WALLET,
    ENCRYPTED_MNEMONIC,
    ExtensionStorage,
    WALLET_LIST
} from "~storage"

import { IStoredWallet } from "./types"
import { encryptMnemonic, hashPassword } from "./encryption"
import { AccountService } from "~account"
import { NETWORKS } from "~constants"
import { mnemonicToAccount } from "viem/accounts"

export * from "./encryption"

export const initWallet = async (mnemonic: string, password: string) => {
    const ethClient = createPublicClient({
        chain: NETWORKS["testnet"],
        transport: http()
    })
    const signer = mnemonicToAccount(mnemonic)
    const account = new AccountService(signer, ethClient as PublicClient)

    const sender = await account.getSender()

    const encryptedMnemonic: string = await encryptMnemonic(
        mnemonic,
        password
    )

    const passwordHash: Hex = hashPassword(password)
}

export const getWallets = async (): Promise<IStoredWallet[]> => {
    const wallets: IStoredWallet[] | undefined =
        await ExtensionStorage.get(WALLET_LIST)

    return wallets || []
}

export const getActiveWallet = async (): Promise<Address | null> => {
    const activeWallet: Address | undefined =
        await ExtensionStorage.get(ACTIVE_WALLET)

    return activeWallet || null
}

export const getMnemonic = async (password: string): Promise<string> => {
    const mnemonic: string | undefined =
        await ExtensionStorage.get(ENCRYPTED_MNEMONIC)
    return mnemonic || ""
}

export const checkPassword = async (password: string): Promise<boolean> => {
    return true
}

export const storeMnemonic = async (mnemonic: string) => {
    await ExtensionStorage.set(ENCRYPTED_MNEMONIC, mnemonic)
}

export const storePassword = async (password: string) => {
    await ExtensionStorage.set(ENCRYPTED_MNEMONIC, password)
}

export const addWallet = async (address: Address)  => {

}
