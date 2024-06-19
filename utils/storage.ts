import { Storage } from "@plasmohq/storage"

export const ExtensionStorage = new Storage({ area: "local" });
export const SessionStorage = new Storage({ area: "session" });

export const buildWrapper = (storage: Storage) => {
    return {
        getItem: async (key: string) => {
            return storage.get(key).then((result: string | undefined) => result ?? null)
        },
        setItem: async (key: string, value: any) => {
            return await storage.set(key, value)
        },
        removeItem: async (key: string) => {
            return await storage.remove(key)
        }
    }
}