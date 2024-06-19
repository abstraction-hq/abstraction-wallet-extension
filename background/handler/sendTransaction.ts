import { Permission } from "~types/permission/types"
import requestPermissions from "./requestPermissions"
import { useWalletStore } from "~stores"
import { IWallet } from "~types/storages/types"
import { onMessage } from "webext-bridge/background"
import { openTab } from "~utils/browser"

const sendTransaction = async (tabId: number, params: any) => {
    return new Promise(async (resolve, reject) => {
        const permissions: Permission[] = await requestPermissions(tabId, [
            {
                eth_accounts: {}
            }
        ])
        for (const permission of permissions) {
            if (permission.parentCapability === "eth_accounts") {
                await openTab("tabs/signTransaction.html")
                onMessage("requestTransactionInfo", () => {
                    return params[0]
                })
                onMessage("signedTransaction", async (data) => {
                    resolve(data)
                })
                
                return
            }
        }

        reject("Permission denied")
    })
}

export default sendTransaction