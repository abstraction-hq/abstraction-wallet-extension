import { Address } from "viem"
import { useWalletStore } from "~stores"
import browser from "webextension-polyfill";


export default class EthNamespace {
    public chainId = async (): Promise<number> => {
        return 1
    }

    public accounts = async (): Promise<Address[]> => {
        const wallets = useWalletStore.getState().wallets
        const walletAddresses = wallets.map((wallet) => wallet.senderAddress)
        return walletAddresses
    }

    public requestAccounts = async (): Promise<string[]> => {
        return await this.accounts()
    }

    public signTypedData_v4 = async (): Promise<string> => {
        return "0x123456789"
    }

    public sendTransaction = async (params: any): Promise<string> => {
        const window = await browser.windows.create({
            url: `${browser.runtime.getURL("popup.html")}`,
            focused: true,
            type: "popup",
            width: 385,
            height: 720
        })
        return "0x123456789"
    }
}
