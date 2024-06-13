import logo from "url:../assets/logo.svg"

interface IRequest {
    readonly method: string
    readonly params?: readonly unknown[] | object
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
                if (res.callID !== data.callID) return
                if (res.type !== "response") return

                window.removeEventListener("message", callback)

                if (event.data.error) {
                    return reject(event.data.message)
                }
                return resolve(event.data.message)
            }
        })
    }
}

// @ts-ignore
window.ethereum = AbstractionWallet

interface EIP6963ProviderInfo {
    uuid: string
    name: string
    icon: string
    rdns: string
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
