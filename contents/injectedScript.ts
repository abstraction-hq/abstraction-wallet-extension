interface IRequest {
    readonly method: string
    readonly params?: readonly unknown[] | object
}

const AbstractionWallet: Record<string, any> = {
    walletName: "abstraction",
    request: async ({ method, params = [] }: IRequest) => {
        // @ts-ignore
        return new Promise((resolve, reject) => {
            // Here you would handle different methods. This is just a placeholder.
            console.log(`Handling request: ${method} with params: ${params}`)
            window.postMessage({ method, params }, window.location.origin)

            window.addEventListener("message", async (event) => {
                console.log(`Received response: ${event}`)
                resolve("Hello from AbstractionWallet!")
            })
        })
    }
}

// @ts-ignore
window.abstraction = AbstractionWallet
