import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { assert } from "console"
import { createPublicClient, http, PublicClient } from "viem"
import { mnemonicToAccount } from "viem/accounts"
import { NETWORKS } from "~constants"
import { AccountService } from "~services"

interface IWallet {
    selectedChain: string
    encryptedMnemonic: string
}

export const useWalletStorage = () => {
    const [wallet, setWallet] = useStorage<IWallet>({
        key: "wallet",
        instance: new Storage()
    })

    const initWallet = async (mnemonic: string): Promise<IWallet> => {
        // const ethClient = createPublicClient({
        //     chain: NETWORKS["testnet"],
        //     transport: http()
        // })
        // const signer = mnemonicToAccount(mnemonic)
        // const account = new AccountService(signer, ethClient as PublicClient)
        // const sender = await account.getSender()
        const wallet = {
            selectedChain: "testnet",
            encryptedMnemonic: mnemonic
        }
        setWallet(wallet)

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