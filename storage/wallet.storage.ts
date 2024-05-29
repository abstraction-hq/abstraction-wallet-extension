import { useStorage } from "@plasmohq/storage/hook"
import { createPublicClient, http, PublicClient } from "viem"
import { mnemonicToAccount } from "viem/accounts"
import { NETWORKS } from "~constants"
import { AccountService } from "~services"
import { ExtensionStorage } from "./storage"

export interface IWallet {
    selectedChain: string
    encryptedMnemonic: string
}


export const useWalletStorage = () => {
    const [wallet, setWallet] = useStorage<IWallet>({
        key: "wallet",
        instance: ExtensionStorage
    })

    const initWallet = async (mnemonic: string): Promise<IWallet> => {
        const wallet = {
            selectedChain: "testnet",
            encryptedMnemonic: mnemonic
        }
        await setWallet(wallet)

        return wallet
    }

    const getAccountService = (): AccountService => {
        let account = null
        if (wallet) {
            account = new AccountService(mnemonicToAccount(wallet.encryptedMnemonic), getEthClient())
        }
        return account as AccountService
    }

    const getEthClient = (): PublicClient => {
        let ethClient = null
        if (wallet) {
            ethClient = createPublicClient({
                chain: NETWORKS[wallet.selectedChain],
                transport: http()
            })
        }
        return ethClient as PublicClient
    }

    return {
        wallet,
        initWallet,
        getAccountService
    }
}