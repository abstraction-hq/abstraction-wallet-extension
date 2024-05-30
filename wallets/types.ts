import { Address } from "viem"

export type IStoredWallet = Address

export interface IStoredMnemonic {
    encryptedMnemonic: string
    passwordHash: string
}