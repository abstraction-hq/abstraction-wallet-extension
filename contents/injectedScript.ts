import logo from "url:../assets/logo.svg"
import { createPublicClient, http, PublicClient } from "viem"
import { NETWORKS } from "~constants"

interface IRequest {
    readonly method: string
    readonly params?: readonly unknown[] | object
}

interface EIP6963ProviderInfo {
    uuid: string
    name: string
    icon: string
    rdns: string
}

const AbstractionWallet: Record<string, any> = {
    walletName: "abstraction",
    isAbstraction: true,
    request: ({ method, params = [] }: IRequest) => {
        // @ts-ignore
        return new Promise(async (resolve, reject) => {
            // Here you would handle different methods. This is just a placeholder.
            const data = {
                method,
                params,
                type: "request",
                callID: Math.random().toString(36).substring(2)
            }

            window.postMessage(data, window.location.origin)

            window.addEventListener("message", callback)

            async function callback(event: any) {
                const { data: res } = event
                if (res.type !== "response") return
                if (res.callID !== data.callID) return

                console.log("handle request", method, "return value", event.data)

                window.removeEventListener("message", callback)

                if (event.data.error) {
                    return reject(event.data.message)
                }
                return resolve(event.data.message)
            }
        })
    },
    on: (method: string, callback: Function) => {
        console.log("on", method)
        window.addEventListener("message", (event: any) => {
            const { data: res } = event
            if (res.type === "event" && res.event === method) {
                callback(res.message)
            }
        })
    }
}

function announceProvider() {
    const info: EIP6963ProviderInfo = {
        uuid: Math.random().toString(36).substring(2),
        name: "Abstraction Wallet",
        icon: logo,
        rdns: "abstraction.world"
    }
    window.dispatchEvent(
        new CustomEvent("eip6963:announceProvider", {
            detail: Object.freeze({ info, provider: AbstractionWallet })
        })
    )
}

window.addEventListener(
    "eip6963:requestProvider",
    () => {
        announceProvider()
    }
)

// @ts-ignore
window.ethereum = AbstractionWallet