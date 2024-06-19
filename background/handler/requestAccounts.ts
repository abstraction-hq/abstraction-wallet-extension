import { Permission } from "~types/permission/types"
import requestPermissions from "./requestPermissions"
import { useWalletStore } from "~stores"
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
                const walletState = useWalletStore.getState()
                const activeWallet: IWallet =
                    walletState.wallets[walletState.activeWallet]
                resolve(activeWallet.senderAddress)
            }
        }

        reject("Permission denied")
    })
}

export default requestAccounts
