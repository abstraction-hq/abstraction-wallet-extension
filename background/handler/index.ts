import { createPublicClient, http } from "viem"
import { NETWORKS } from "~constants"
import { useConfigStore } from "~stores"
import { Response } from "~types/message/types"
import requestAccounts from "./requestAccounts"
import requestPermissions from "./requestPermissions"
import getPermissions from "./getPermissions"
import sendTransaction from "./sendTransaction"
import { openTab } from "~utils/browser"

const handleRequest = async ({data, sender}: any): Promise<Response> => {
    const baseResponse: Response = {
        callID: data.callID,
        type: "response"
    }

    try {
        const { method, params } = data
        let res: any

        switch (method) {
            case "eth_requestAccounts":
                res = await requestAccounts(sender.tabId)
                break
            case "eth_accounts":
                res = await requestAccounts(sender.tabId)
                break
            case "eth_sendTransaction":
                res = await sendTransaction(sender.tabId, params)
                break
            case "wallet_requestPermissions":
                res = await requestPermissions(sender.tabId, params)
                break
            case "wallet_getPermissions":
                res = await getPermissions(sender.tabId)
                break
            default:
                try {
                    const activeNetwork = useConfigStore.getState().activeNetwork
                    const ethClient = createPublicClient({
                        chain: NETWORKS[activeNetwork],
                        transport: http()
                    })

                    res = await ethClient.request({
                        method,
                        params
                    })
                } catch (err: any) {
                    throw(`Method ${method} not found. Details: ${err}`)
                }
        }

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

const onExtensionInstalled = async () => {
    openTab("welcome")
}

export {
    handleRequest,
    onExtensionInstalled
}
