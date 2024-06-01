import { createPublicClient, http, PublicClient } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { create } from 'zustand'
import { NETWORKS } from '~constants'
import { AccountService } from '~account'

export const useWalletState = create((set) => ({
    account: null,
    ethClient: null,
    setWalletState: (selectedChain: string, mnemonic: string, signerIndex: number) => {
        const ethClient = createPublicClient({
            chain: NETWORKS[selectedChain],
            transport: http()
        })
        const signer = mnemonicToAccount(mnemonic, {
            addressIndex: signerIndex
        })
        const account = new AccountService(signer, ethClient as PublicClient)
        set({
            account,
            ethClient
        })
    },
}))
