import { Storage } from "@plasmohq/storage"

export const ExtensionStorage = new Storage({ area: "local" });
export const SessionStorage = new Storage({ area: "session" });

export const ExtensionStorageWrapper = {
    getItem: (key: string) => {
        return ExtensionStorage.get(key).then((result: string | undefined) => result ?? null)
    },
    setItem: async (key: string, value: any) => {
        return await ExtensionStorage.set(key, value)
    },
    removeItem: async (key: string) => {
        return await ExtensionStorage.remove(key)
    }
}

// key for wallet
export const WALLET_LIST: string = "wallets"
export const ACTIVE_WALLET: string = "active_wallet"
export const ENCRYPTED_MNEMONIC: string = "encrypted_mnemonic"
export const PASSWORD_HASH: string = "password_hash"