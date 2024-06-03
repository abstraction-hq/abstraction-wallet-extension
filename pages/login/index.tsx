import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useWalletState } from "~states"
import { checkPassword, getActiveWallet, getMnemonic } from "~wallets"
import { IStoredWallet } from "~wallets/types"

export const Login = () => {
    const [password, setPassword] = useState<string>("")
    const [activeWallet, setActiveWallet] = useState<IStoredWallet>()
    const [alert, setAlert] = useState<string>("")
    const navigator = useNavigate()

    const setWalletState = useWalletState((state: any) => state.setWalletState)

    useEffect(() => {
        ;(async () => {
            const wallet = await getActiveWallet()
            if (!wallet) {
                navigator("/create")
            } else {
                setActiveWallet(wallet)
            }
        })()
    }, [])

    useEffect(() => {
        setAlert("")
    }, [password])

    const onLogin = async (e: any) => {
        e.preventDefault()
        console.log(password)
        const validPassword = await checkPassword(password)
        if (!validPassword) {
            setAlert("Invalid password")
        } else {
            const mnemonic = await getMnemonic(password)
            setWalletState("testnet", mnemonic, activeWallet?.index)
            navigator("/home")
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <form className="flex flex-col space-y-4" onSubmit={onLogin}>
                <h1 className="text-xl font-bold text-center">Login</h1>
                <div className="flex flex-col">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {alert.length > 0 ? (
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">
                            {alert}
                        </label>
                    </div>
                ) : (
                    <></>
                )}
                <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={onLogin}>
                    Login
                </button>
            </form>
        </div>
    )
}
