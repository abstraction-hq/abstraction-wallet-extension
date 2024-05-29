import { createPublicClient, http, PublicClient } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { create } from 'zustand'
import { NETWORKS } from '~constants'
import { AccountService } from '~services'

export const useWalletState = create((set) => ({
    account: null,
    ethClient: null,
    initState: (selectedChain: string, mnemonic: string) => {
        const ethClient = createPublicClient({
            chain: NETWORKS[selectedChain],
            transport: http()
        })
        const signer = mnemonicToAccount(mnemonic)
        const account = new AccountService(signer, ethClient as PublicClient)
        set({
            account,
            ethClient
        })
    },
}))
