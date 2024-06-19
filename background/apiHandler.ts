import { Address, createPublicClient, http, PublicClient, zeroAddress } from "viem"
import { onMessage } from "webext-bridge/background"
import { NETWORKS } from "~constants"
import { useWalletStore, useConfigStore, useDappStore } from "~stores"
import { IDapp, IWallet } from "~types/storages/types"
import { Permission } from "~types/permission/types"
import { Account, calculateSenderAddress } from "~utils/account"
import { getDappHostName, getDappInfo, openTab } from "~utils/browser"
import { ExtensionStorage } from "~utils/storage"

export default class APIHandler {
    private events: any
    private account: Account
    private ethClient: PublicClient

    constructor() {
        const activeWallet: IWallet = useWalletStore.getState().wallets[useWalletStore.getState().activeWallet]
        this.account = new Account(activeWallet.signerAddress)
        const activeNetwork = useConfigStore.getState().activeNetwork
        this.ethClient = createPublicClient({
            chain: NETWORKS[activeNetwork],
            transport: http()
        }) as PublicClient

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
        const wallet = useWalletStore
            .getState()
            .wallets.find((wallet) => wallet.id === activeWallet)
        if (!wallet) return
        this.account = new Account(wallet.signerAddress)
    }

    private _getPermissions = async (tabId: number): Promise<Permission[]> => {
        return new Promise(async (resolve, reject) => {
            const hostname: string = await getDappHostName(tabId)
            const dappPermissions = useDappStore.getState().dappPermissions
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

    private _requestAccounts = async (tabId: number): Promise<Address[]> => {
        return new Promise(async (resolve, reject) => {
            const permissions = await this._requestPermissions(tabId, [{
                eth_accounts: {}
            }])
            for (const permission of permissions) {
                if (permission.parentCapability === "eth_accounts") {
                    const walletState = useWalletStore.getState()
                    const activeWallet: IWallet = walletState.wallets[walletState.activeWallet]
                    resolve([calculateSenderAddress(activeWallet.signerAddress)])
                }
            }
        })
    }

    private _sendTransaction = async (tabId: number, params: any): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            const permissions = await this._requestPermissions(tabId, [{
                eth_accounts: {}
            }])
            for (const permission of permissions) {
                if (permission.parentCapability === "eth_accounts") {
                    const walletState = useWalletStore.getState()
                    const activeWallet: IWallet = walletState.wallets[walletState.activeWallet]
                    const activeNetwork = useConfigStore.getState().activeNetwork
                    const ethClient = createPublicClient({
                        chain: NETWORKS[activeNetwork],
                        transport: http()
                    }) as PublicClient

                    resolve("Transaction sent")
                }
            }
        })
    }

    private _requestPermissions = async (tabId: number, params: any): Promise<Permission[]> => {
        return new Promise(async (resolve, reject) => {
            const dappPermissions = useDappStore.getState().dappPermissions
            const hostname: string = await getDappHostName(tabId)

            const result: Permission[] = []
            
            if (params && "eth_accounts" in params[0] && dappPermissions[hostname]?.includes("eth_accounts")) {
                result.push({
                    invoker: hostname,
                    parentCapability: "eth_accounts",
                    caveats: []
                })

                resolve(result)
                return
            } else {
                await openTab("tabs/connect.html")
                const dappInfo: IDapp = await getDappInfo(tabId)

                onMessage("requestDappInfo", ({sender}) => {
                    return dappInfo
                })

                onMessage("connect" ,( {data, sender} ) => {
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

    private _handleMessage = async ({data, sender}: any): Promise<unknown> => {
        const { method, params } = data
        switch (method) {
            case "eth_requestAccounts":
                return this._requestAccounts(sender.tabId)
            case "eth_accounts":
                return this._requestAccounts(sender.tabId)
            case "eth_sendTransaction": 
                return this._sendTransaction(sender.tabId, params)
            case "wallet_requestPermissions":
                return this._requestPermissions(sender.tabId, params)
            case "wallet_getPermissions":
                return this._getPermissions(sender.tabId)
            default:
                try {
                    const activeNetwork = useConfigStore.getState().activeNetwork
                    const ethClient = createPublicClient({
                        chain: NETWORKS[activeNetwork],
                        transport: http()
                    }) as PublicClient

                    return ethClient.request({
                        method,
                        params
                    })
                } catch (err: any) {
                    throw(`Method ${method} not found. Details: ${err}`)
                }
        }
    }

    public handleApi = async (params: any): Promise<unknown> => {
        const baseResponse = {
            callID: params.data.callID,
            type: "response"
        }

        try {
            console.log("Request", params.data.method)

            const res: any = await this._handleMessage({
                ...params
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
