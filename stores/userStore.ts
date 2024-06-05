import localforage from "localforage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { IUserStoreState } from "./types"

export const useUserStore = create<IUserStoreState>()(
    persist(
        (set) => ({
            credentials: undefined,
            onSetCredentials: (credentials) => set({ credentials }),
        }),
        {
            name: "useUserStore",
            storage: createJSONStorage(() => localforage)
        }
    )
)
