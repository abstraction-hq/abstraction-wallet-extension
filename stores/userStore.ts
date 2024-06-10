import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { IUserStoreState } from "~types/storages/types"
import { ExtensionStorageWrapper } from "~utils/storage"

export const useUserStore = create<IUserStoreState>()(
    persist(
        (set) => ({
            credentials: undefined,
            onSetCredentials: (credentials) => set({ credentials }),
        }),
        {
            name: "userStore",
            storage: createJSONStorage(() => ExtensionStorageWrapper),
        }
    )
)
