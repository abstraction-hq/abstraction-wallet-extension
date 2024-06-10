import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts"

import { Account } from "~utils/account"
import { encryptMnemonic, hashPassword } from "~utils/encryption"
import { useUserStore, useWalletStore } from "~stores"
import { createPublicClient, http, PublicClient } from "viem"
import { NETWORKS } from "~constants"
import { handleUserOp } from "~utils/bundler"

const CreateView = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const wallets = useWalletStore((state) => state.wallets)
    const setUserCredentials = useUserStore((state) => state.onSetCredentials)
    const createWallet = useWalletStore((state) => state.onCreateWallet)

    const [alert, setAlert] = useState("")

    const navigator = useNavigate()

    useEffect(() => {
        setAlert("")
    }, [confirmPassword, password])

    const initUserCredentials = async (mnemonic: string, password: string) => {
        const encryptedMnemonic = await encryptMnemonic(mnemonic, password)
        const passwordHash = hashPassword(password)

        setUserCredentials({
            password: passwordHash,
            encryptedMnemonic: encryptedMnemonic
        })
    }

    const initWallet = async (mnemonic: string) => {
        const signer = mnemonicToAccount(mnemonic, { addressIndex: 0 })
        const account = new Account(signer.address)
        const sender = account.getSender()

        const ethClient = createPublicClient({
            chain: NETWORKS["testnet"],
            transport: http()
        }) as PublicClient

        const [initWalletOp, userOpHash] = await account.sendTransactionOperation(ethClient, [{
            target: "0x49827013C5a9ac04136BA5576b0dD56408DaEf34",
            value: 0n,
            data: "0x"
        }])

        const signature = await signer.signMessage({
            message: {
                raw: userOpHash,
            }
        })
        initWalletOp.signature = signature

        const txHash = await handleUserOp(initWalletOp)
        console.log(txHash)

        // createWallet({
        //     id: 0,
        //     name: `Wallet 1`,
        //     senderAddress: sender,
        //     signerAddress: account.address
        // })
    }

    const onCreateWallet = async () => {
        if (password != confirmPassword) {
            setAlert("password mismatch")
        } else {
            // const mnemonic = generateMnemonic(english)
            const mnemonic = "scorpion orbit dynamic moon cloth wall doll pottery struggle garbage paddle between" // for testing

            await initUserCredentials(mnemonic, password)
            await initWallet(mnemonic)

            // navigator("/home")
        }
    }

    return (
        <div>
            <div className="p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Create Wallet
                </h2>
                <form action="#">
                    <div className="mb-4">
                        <label
                            className="block text-sm font-bold mb-2"
                            htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-sm font-bold mb-2"
                            htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {alert.length > 0 ? (
                        <div className="mb-6">
                            <label
                                className="block text-sm font-bold mb-2"
                                htmlFor="confirm-password">
                                {alert}
                            </label>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={onCreateWallet}>
                            Create Wallet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateView
