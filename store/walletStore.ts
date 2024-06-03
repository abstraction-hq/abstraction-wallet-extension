import { create } from "zustand";
import { IWalletStoreState } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";
import localforage from "localforage";

export const useWalletStore = create<IWalletStoreState>()(persist(
  (set) => ({
    wallet: [],
    onCreateWallet: (createObject) => {
      set(state => ({
        wallet: [...state.wallet, createObject],
        activeWallet: createObject.id
      }))
    }
  }),
  {
    name: 'wallet-store',
    storage: createJSONStorage(() => localforage)
  }
))