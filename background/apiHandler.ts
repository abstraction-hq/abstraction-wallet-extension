import { createPublicClient, http, PublicClient } from "viem"
import { NETWORKS } from "~constants"
import { useWalletStore } from "~stores"
import { useConfigStore } from "~stores/configStore"
import { Account } from "~utils/account"
import { ExtensionStorage } from "~utils/storage"

export default class APIHandler {
    private ethClient: PublicClient
    private account: Account | null
    private events: any

    constructor() {
        const activeNetwork: string = useConfigStore.getState().activeNetwork
        this.ethClient = createPublicClient({
            chain: NETWORKS[activeNetwork],
            transport: http()
        }) as PublicClient

        this.account = null

        this._listenForStoreChange()
    }

    private _listenForStoreChange = () => {
        ExtensionStorage.watch({
            configStore: ({ oldValue, newValue }) => {
                if (oldValue.activeNetwork !== newValue.activeNetwork) {
                    this._switchChain(newValue.activeNetwork)
                    this._emit("chainChanged", newValue.activeNetwork)
                }
            },
            walletStore: ({ oldValue, newValue }) => {
                if (oldValue.activeWallet !== newValue.activeWallet) {
                    this._switchAccount(newValue.activeWallet)
                    this._emit("walletChanged", newValue.activeWallet)
                }
            }
        })
    }

    // Method to emit events
    private _emit = (event: string, data: any) => {
        if (!this.events[event]) return

        this.events[event].forEach((listener: any) => listener(data))
    }

    private _switchChain = (network: string) => {
        this.ethClient = createPublicClient({
            chain: NETWORKS[network],
            transport: http()
        }) as PublicClient
    }

    private _switchAccount = (activeWallet: number) => {
        const wallet = useWalletStore.getState().wallets.find((wallet) => wallet.id === activeWallet)
        if (!wallet) return
        this.account = new Account(wallet.signerAddress)
    }

    private _requestPermissions = async (params: any) => {
        return {
            "parentCapability": "eth_accounts",
        }
    }

    private _handleMessage = async ({ method, params }: any): Promise<unknown> => {
        switch (method) {
            case "wallet_requestPermissions":
                return this._requestPermissions(params)
            default:
                return this.ethClient.request(method, params)
        }
    }

    public handleApi = async ({ data }: any): Promise<unknown> => {
        const baseResponse = {
            callID: data.callID,
            type: "response"
        }

        try {
            const res: any = await this._handleMessage({
                ...data
            })

            return {
                ...baseResponse,
                error: false,
                message: res
            }
        } catch (error) {
            return {
                ...baseResponse,
                error: true,
                message: error
            }
        }
    }
}
