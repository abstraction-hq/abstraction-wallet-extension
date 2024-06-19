import { Address } from "viem"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { IDapp, IDappStoreState } from "~types/storages/types"
import { ExtensionStorage, buildWrapper } from "~utils/storage"

export const useDappStore = create<IDappStoreState>()(
    persist(
        (set) => ({
            dappInfos: {},
            dappPermissions: {},
            onAddPermission: (hostname: string, info: IDapp, permissions: string[]) => set(
                (state) => {
                    state.dappInfos[hostname] = info
                    if (!state.dappPermissions[hostname]) {
                        state.dappPermissions[hostname] = []
                    }
                    for (const permission of permissions) {
                        if (!state.dappPermissions[hostname].includes(permission)) {
                            state.dappPermissions[hostname].push(permission)
                        }
                    }
                    return { ...state }
                }
            ),
            onRemovePermission: (hostname: string) => set(
                (state) => {
                    delete state.dappInfos[hostname]
                    delete state.dappPermissions[hostname]
                    return { ...state }
                }
            )
        }),
        {
            name: "dappStore",
            storage: createJSONStorage(() => buildWrapper(ExtensionStorage)),
        }
    )
)
