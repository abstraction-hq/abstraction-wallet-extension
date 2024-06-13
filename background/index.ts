import { onMessage } from "webext-bridge/background"
import EthNamespace from "~namespace/eth"
import WalletNamespace from "~namespace/wallet"

const ethNamespace = new EthNamespace()
const walletNamespace = new WalletNamespace() 

const modules: any = {
    eth: ethNamespace,
    wallet: walletNamespace
}

console.log("Background script running")

onMessage("api_call", async ({data, sender}: any) => {
    const baseResponse = {
        callID: data.callID,
        type: "response"
    }
    const method = data.method
    const [namespace, ...requestApi] = method.split("_")
    const requestFunc = requestApi.join("_")

    const func = modules[namespace][requestFunc]
    if (typeof func !== "function") {
        return {
            ...baseResponse,
            error: true,
            message: `Method ${method} not found in ${namespace} namespace`
        }
    }
    const res = await func(data.params)
    return {
        ...baseResponse,
        error: false,
        message: res
    }
})
