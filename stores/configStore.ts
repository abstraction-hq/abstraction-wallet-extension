import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { IConfigStoreState } from "~types/storages/types"
import { ExtensionStorage, buildWrapper } from "~utils/storage"

export const useConfigStore = create<IConfigStoreState>()(
    persist(
        (set) => ({
            activeNetwork: "testnet",
            onSetActiveNetwork: (network: string) => set({ activeNetwork: network }),
        }),
        {
            name: "configStore",
            storage: createJSONStorage(() => buildWrapper(ExtensionStorage)),
        }
    )
)
