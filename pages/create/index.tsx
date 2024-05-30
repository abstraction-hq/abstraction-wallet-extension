import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { english, generateMnemonic } from "viem/accounts"

export const Create = () => {
    const [generatedMnemonic, setGeneratedMnemonic] = useState("")
    const navigator = useNavigate()

    useEffect(() => {
        const mnemonic = generateMnemonic(english)
        setGeneratedMnemonic(mnemonic)
    }, [])

    useEffect(() => {
    })

    const onCreateWallet = async () => {
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