import { Address } from "viem"
import { useWalletStore } from "~stores"
import browser from "webextension-polyfill";
import { onMessage, sendMessage } from "webext-bridge/background";


export default class EthNamespace {
    public chainId = async (): Promise<number> => {
        return 1
    }

    public accounts = async (): Promise<Address[]> => {
        const wallets = useWalletStore.getState().wallets
        const walletAddresses = wallets.map((wallet) => wallet.senderAddress)
        return walletAddresses
    }

    public requestAccounts = async (): Promise<string[]> => {
        return await this.accounts()
    }

    public signTypedData_v4 = async (): Promise<string> => {
        return "0x123456789"
    }

    public sendTransaction = async (params: any): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            // const storeTransaction = useSignTransactionStore.getState().onSetTransaction
            // await storeTransaction(params)
            browser.windows.create({
                url: `${browser.runtime.getURL("tabs/signTransaction.html")}`,
                focused: true,
                type: "popup",
                width: 357,
                height: 600
            })

            onMessage("ready-for-transaction", ({sender}) => {
                sendMessage("signTransaction", params, `popup@${sender.tabId}`)
            })

            onMessage("signedTransaction", (data: any) => {
                resolve(data)
            })
        })
    }
}
