export default class WalletNamespace {
    public requestPermissions = (params: any) => {
        console.log("Requesting permissions", params)
        return [{
            "parentCapability": "eth_accounts",
        }]
    }
}