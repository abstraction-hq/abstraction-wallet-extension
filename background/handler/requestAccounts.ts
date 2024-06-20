import { Permission } from "~types/permission/types"
import requestPermissions from "./requestPermissions"
import { getStore } from "~utils/storage"
import { IWallet } from "~types/storages/types"

const requestAccounts = async (tabId: number) => {
    return new Promise(async (resolve, reject) => {
        const permissions: Permission[] = await requestPermissions(tabId, [
            {
                eth_accounts: {}
            }
        ])
        for (const permission of permissions) {
            if (permission.parentCapability === "eth_accounts") {
                const walletStore = await getStore("walletStore")
                const activeWallet: IWallet = walletStore.wallets[walletStore.activeWallet]
                resolve([activeWallet.senderAddress])
            }
        }

        reject("Permission denied")
    })
}

export default requestAccounts
