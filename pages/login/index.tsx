import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getWallets } from "~wallets"

export const Login = () => {
    // const { wallet } = useWalletStorage()
    const navigator = useNavigate()

    useEffect(() => {
        (async () => {
            const wallets = await getWallets()
            if (wallets.length == 0) {
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