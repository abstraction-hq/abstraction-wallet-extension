import { Address } from "viem"

export type IStoredWallet = {
    index: number
    address: Address
}

export interface IStoredMnemonic {
    encryptedMnemonic: string
    passwordHash: string
}