import { Permission } from "~types/permission/types"
import requestPermissions from "./requestPermissions"
import { onMessage, sendMessage } from "webext-bridge/background"
import { openWindow } from "~utils/browser"

const sendTransaction = async (tabId: number, params: any) => {
    return new Promise(async (resolve, reject) => {
        const permissions: Permission[] = await requestPermissions(tabId, [
            {
                eth_accounts: {}
            }
        ])
        for (const permission of permissions) {
            if (permission.parentCapability === "eth_accounts") {
                await openWindow("signTransaction")
                onMessage("requestTransactionInfo", () => {
                    return params[0]
                })
                onMessage("signTransactionResult", async (data: any) => {
                    if (data == "reject") {
                        reject("Transaction rejected")
                    } else {
                        resolve(data)
                    }
                })
                
                return
            }
        }

        reject("Permission denied")
    })
}

export default sendTransaction