import { onMessage } from "webext-bridge/background"
import EthNamespace from "~namespace/eth"
import { ExtensionStorage } from "~utils/storage"

const eth = new EthNamespace()

const modules: any = {
    eth: eth
}

onMessage("api_call", async (event) => {
    const { data }: any = event
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
