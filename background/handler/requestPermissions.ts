import { onMessage } from "webext-bridge/background"
import { getStore } from "~utils/storage"
import { Permission } from "~types/permission/types"
import { IDapp } from "~types/storages/types"
import { getDappHostName, getDappInfo, openTab, openWindow } from "~utils/browser"

const requestPermissions = async (tabId: number, params: any): Promise<Permission[]> => {
    return new Promise(async (resolve, reject) => {
        const dappStore = await getStore("dappStore")
        const dappPermissions = dappStore.dappPermissions
        const hostname: string = await getDappHostName(tabId)

        const result: Permission[] = []

        const userStore = await getStore("userStore")
        if (!userStore.credentials) {
            openTab("welcome")
            reject("User is not authenticated")
            return
        }

        if (
            params &&
            "eth_accounts" in params[0] &&
            dappPermissions[hostname] &&
            dappPermissions[hostname].includes("eth_accounts")
        ) {
            result.push({
                invoker: hostname,
                parentCapability: "eth_accounts",
                caveats: []
            })

            resolve(result)
        } else {
            await openWindow("connect")
            const dappInfo: IDapp = await getDappInfo(tabId)

            onMessage("requestDappInfo", ({ sender }) => {
                return dappInfo
            })

            onMessage("connect", ({ data, sender }) => {
                if (data == "reject") {
                    reject("User denied the request")
                }
                for (const permission of data as string[]) {
                    result.push({
                        invoker: dappInfo.hostname,
                        parentCapability: permission,
                        caveats: []
                    })
                }

                resolve(result)
            })
        }
    })
}

export default requestPermissions
