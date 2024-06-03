import { Hex } from "viem";

export interface Mnemonic {
    encryptedSeed: string
    password: string
}

export interface Wallet {
    id: string
    name: string
    address: Hex
}

export interface IWalletStoreState {
  activeWallet?: string
  wallet: Wallet[]
  mnemonic?: Mnemonic
  onCreateWallet: (createObject: Wallet) => void
}