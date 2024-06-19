import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { IAuthStoreState } from "~types/storages"
import { SessionStorage, buildWrapper } from "~utils/storage"

export const useAuthStore = create<IAuthStoreState>()(
    persist(
        (set) => ({
            password: undefined,
            isUnlocked: false,
            onUnlock: (password: string) => set({ password, isUnlocked: true }),
            onLock: () => set({ password: undefined, isUnlocked: false })
        }),
        {
            name: "authStore",
            storage: createJSONStorage(() => buildWrapper(SessionStorage)), // use session storage
        }
    )
)
