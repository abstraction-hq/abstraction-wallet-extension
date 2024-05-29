import React, { useEffect, useState } from "react"
import { english, generateMnemonic } from "viem/accounts"
import { useWalletStorage } from "~storage"

export const Create = () => {
    const [generatedMnemonic, setGeneratedMnemonic] = useState("")
    const { wallet, initWallet } = useWalletStorage()

    useEffect(() => {
        const mnemonic = generateMnemonic(english)
        setGeneratedMnemonic(mnemonic)
    }, [])

    const onCreateWallet = async () => {
        await initWallet(generatedMnemonic)
    }

    return (
        <div>
            <div>Create Wallet</div>
            <div>Backup seed</div>
            <input value={generatedMnemonic}></input>
            <button onClick={onCreateWallet}>Create wallet</button>
        </div>
    )
}