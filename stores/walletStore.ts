import { create } from "zustand"
import {
    createJSONStorage,
    persist,
} from "zustand/middleware"

import { IWallet, IWalletStoreState } from "~types/storages/types"
import { ExtensionStorage, buildWrapper } from "~utils/storage"

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
                    ...state,
                    activeWallet: id
                }))
            }
        }),
        {
            name: "walletStore",
            storage: createJSONStorage(() => buildWrapper(ExtensionStorage))
        }
    )
)
