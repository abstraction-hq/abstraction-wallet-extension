import { useStorage } from "@plasmohq/storage/hook"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { english, generateMnemonic } from "viem/accounts"
import { IWallet, useWalletStorage } from "~storage"

export const Create = () => {
    const [generatedMnemonic, setGeneratedMnemonic] = useState("")
    const {wallet, initWallet} = useWalletStorage()
    const navigator = useNavigate()

    useEffect(() => {
        const mnemonic = generateMnemonic(english)
        setGeneratedMnemonic(mnemonic)
    }, [])

    useEffect(() => {
        console.log(wallet)
    })

    const onCreateWallet = async () => {
        await initWallet(generatedMnemonic)
        navigator("/")
    }

    return (
        <div>
            <p>Create Wallet</p>
            <p>Backup seed: </p>
            <input defaultValue={generatedMnemonic}></input>
            <button onClick={onCreateWallet}>Create wallet</button>
        </div>
    )
}