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

interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo
    provider: any
}

// Announce Event dispatched by a Wallet
interface EIP6963AnnounceProviderEvent extends CustomEvent {
    type: "eip6963:announceProvider"
    detail: EIP6963ProviderDetail
}

interface EIP6963RequestProviderEvent extends Event {
    type: "eip6963:requestProvider"
}

function announceProvider() {
    const info: EIP6963ProviderInfo = {
        uuid: "350670db-19fa-4704-a166-e52e178b59d2",
        name: "Abstraction Wallet",
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
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
