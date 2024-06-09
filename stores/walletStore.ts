import localforage from "localforage"
import { create } from "zustand"
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware"

import { IWallet, IWalletStoreState } from "./types"

export const useWalletStore = create<IWalletStoreState>()(
    subscribeWithSelector(
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
                        ...state,
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
    
)
