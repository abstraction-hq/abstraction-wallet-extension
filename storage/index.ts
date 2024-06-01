import { Storage } from "@plasmohq/storage"

export const ExtensionStorage = new Storage({ area: "local" });

// key for wallet
export const WALLET_LIST: string = "wallets"
export const ACTIVE_WALLET: string = "active_wallet"
export const ENCRYPTED_MNEMONIC: string = "encrypted_mnemonic"
export const PASSWORD_HASH: string = "password_hash"
