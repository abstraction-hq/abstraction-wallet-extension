import localforage from "localforage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { IWallet, IWalletStoreState } from "./types"

export const useWalletStore = create<IWalletStoreState>()(
    persist(
        (set) => ({
            wallets: [],
            activeWallet: 0,
            onCreateWallet: (wallet: IWallet) => {
                set((state) => ({
                    wallets: [...state.wallets, wallet],
                    activeWallet: wallet.id
                }))
            },
            setActiveWallet: (id: number) => {
                set((state) => ({
                    activeWallet: id
                }))
            }
        }),
        {
            name: "useWalletStore",
            storage: createJSONStorage(() => localforage)
        }
    )
)
