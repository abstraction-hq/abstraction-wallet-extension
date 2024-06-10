import { useWalletStore } from "~stores"

export default class EthNamespace {
    public chainId = async (): Promise<number> => {
        return 1
    }

    public accounts = async (): Promise<string[]> => {
        return ["0x4FFF0f708c768a46050f9b96c46C265729D1a62f"]
    }

    public requestAccounts = async (): Promise<string[]> => {
        return ["0x4FFF0f708c768a46050f9b96c46C265729D1a62f"]
    }

    public signTypedData_v4 = async (): Promise<string> => {
        return "0x123456789"
    }
}