import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { IDappStoreState } from "~types/storages/types"
import { ExtensionStorage, buildWrapper } from "~utils/storage"

// export const useDappStore = create<IDappStoreState>()(
//     persist(
//         (set) => ({
//             activeNetwork: "testnet",
//             onSetActiveNetwork: (network: string) => set({ activeNetwork: network }),
//         }),
//         {
//             name: "configStore",
//             storage: createJSONStorage(() => buildWrapper(ExtensionStorage)),
//         }
//     )
// )
