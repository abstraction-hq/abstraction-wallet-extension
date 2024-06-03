import { create } from "zustand";
import localforage from "localforage";
import { IUserCredentials, IUserStoreState } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

export const useUserStore = create<IUserStoreState>()(persist(
  (set) => ({
    credentials: undefined,
    onSetCredentials: (credentials: IUserCredentials) => {
      set(() => ({
        credentials: credentials
      }))
    },
    initMnemonic: (mnemonic: string) => {
      set(state => ({
        credentials: {
          ...state.credentials,
          encryptedMnemonic: mnemonic
        }
      }))
    }
  }),
  {
    name: 'user-store',
    storage: createJSONStorage(() => localforage)
  }
))