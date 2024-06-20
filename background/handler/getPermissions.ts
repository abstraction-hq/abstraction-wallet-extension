import { getStore } from "~utils/storage"
import { Permission } from "~types/permission/types"
import { getDappHostName } from "~utils/browser"

const getPermissions = async (tabId: number): Promise<Permission[]> => {
    return new Promise(async (resolve, reject) => {
        const hostname: string = await getDappHostName(tabId)
        const dappStore = await getStore("dappStore")
        const dappPermissions = dappStore.dappPermissions
        const result: Permission[] = []
        for (const permission of dappPermissions[hostname]) {
            result.push({
                invoker: hostname,
                parentCapability: permission,
                caveats: []
            })
        }

        resolve(result)
    })
}

export default getPermissions