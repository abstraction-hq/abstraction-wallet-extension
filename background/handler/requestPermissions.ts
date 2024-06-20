import { onMessage } from "webext-bridge/background"
import { useDappStore } from "~stores"
import { Permission } from "~types/permission/types"
import { IDapp } from "~types/storages/types"
import { getDappHostName, getDappInfo, openWindow } from "~utils/browser"

const requestPermissions = async (tabId: number, params: any): Promise<Permission[]> => {
    return new Promise(async (resolve, reject) => {
        const dappPermissions = useDappStore.getState().dappPermissions
        const hostname: string = await getDappHostName(tabId)

        const result: Permission[] = []

        if (
            params &&
            "eth_accounts" in params[0] &&
            dappPermissions[hostname]?.includes("eth_accounts")
        ) {
            result.push({
                invoker: hostname,
                parentCapability: "eth_accounts",
                caveats: []
            })

            resolve(result)
            return
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
