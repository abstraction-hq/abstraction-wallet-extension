import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useWalletStorage } from "~storage"
import { ExtensionStorage } from "~storage/storage"

export const Login = () => {
    // const { wallet } = useWalletStorage()
    const navigator = useNavigate()

    useEffect(() => {
        (async () => {
            const wallet = await ExtensionStorage.get("wallet")
            console.log(wallet)
            if (!wallet) {
                navigator("/create")
            }
        })()
    })

    const onLogin = async () => {
        // initState(wallet.selectedChain, wallet.encryptedMnemonic)
        navigator("/home")
        // await initWallet(mnemonic)
    }

    return (
        <div>
            <button className="btn" onClick={onLogin}>Login</button>
        </div>
    )
}