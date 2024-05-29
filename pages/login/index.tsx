import React, { useEffect } from "react"
import { useWalletStorage } from "~storage"
import { english, generateMnemonic } from "viem/accounts"
import { useNavigate } from "react-router-dom"
import { useWalletState } from "~states"

export const Login = () => {
    const { wallet, initWallet } = useWalletStorage()
    const initState = useWalletState((state: any) => state.initState)
    const navigator = useNavigate()

    useEffect(() => {
        if (wallet) {
            initState(wallet.selectedChain, wallet.encryptedMnemonic)
            navigator("/home")
        }
    }, [wallet])

    const onCreateWallet = async () => {
        const mnemonic = generateMnemonic(english)
        await initWallet(mnemonic)
    }

    return (
        <div>
            <button className="btn" onClick={onCreateWallet}>Create Wallet</button>
        </div>
    )
}