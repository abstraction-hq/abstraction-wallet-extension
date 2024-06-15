import { Address, createPublicClient, http, PublicClient } from "viem"
import { onMessage, sendMessage } from "webext-bridge/background"
import browser from "webextension-polyfill"

import { NETWORKS } from "~constants"
import { useWalletStore } from "~stores"
import { useConfigStore } from "~stores/configStore"
import { ExtensionStorage } from "~utils/storage"

export default class EthNamespace {
    private ethClient: PublicClient
    private events: any

    constructor() {
        const activeNetwork: string = useConfigStore.getState().activeNetwork
        this.ethClient = createPublicClient({
            chain: NETWORKS[activeNetwork],
            transport: http()
        }) as PublicClient

        this._listenForNetworkChange()
    }

    private _listenForNetworkChange = () => {
        ExtensionStorage.watch({
            configStore: ({ oldValue, newValue }) => {
                if (oldValue.activeNetwork !== newValue.activeNetwork) {
                    this.switchChain(newValue.activeNetwork)
                    this.emit("chainChanged", newValue.activeNetwork)
                }
            }
        })
    }

    // Method to emit events
    private emit = (event: string, data: any) => {
        if (!this.events[event]) return

        this.events[event].forEach((listener: any) => listener(data))
    }

    // Method to add event listeners
    public on = (event: string, listener: any) => {
        if (!this.events[event]) {
            this.events[event] = []
        }
        this.events[event].push(listener)
    }

    // Method to remove event listeners
    public removeListener = (event: string, listenerToRemove: any) => {
        if (!this.events[event]) return

        this.events[event] = this.events[event].filter(
            (listener: any) => listener !== listenerToRemove
        )
    }

    public switchChain = (network: string) => {
        this.ethClient = createPublicClient({
            chain: NETWORKS[network],
            transport: http()
        }) as PublicClient
    }

    public chainId = async (): Promise<number> => {
        return await this.ethClient.getChainId()
    }

    public blockNumber = async (): Promise<bigint> => {
        return await this.ethClient.getBlockNumber()
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
                height: 600,
                
            })

            onMessage("ready-for-transaction", ({ sender }) => {
                sendMessage("signTransaction", params, `popup@${sender.tabId}`)
            })

            onMessage("signedTransaction", ({ data }: any) => {
                resolve(data)
            })
        })
    }
}
