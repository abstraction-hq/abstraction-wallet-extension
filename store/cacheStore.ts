import { create } from "zustand";
import localforage from "localforage";
import { ICacheStoreState } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCacheStore = create<ICacheStoreState>()(persist(
    (set) => ({
        cachePassword: undefined,
        onInitCache: (password: string) => {
            set(() => ({
                cachePassword: password
            }))

            setTimeout(() => {
                set(() => ({
                    cachePassword: undefined
                }))
            }, 1000 * 60 * 5)
        }
    }),
    {
        name: 'user-store',
        storage: createJSONStorage(() => localforage)
    }
))