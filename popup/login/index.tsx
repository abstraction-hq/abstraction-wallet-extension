import React, { useEffect, useState } from "react"
import { useFetcher, useNavigate } from "react-router-dom"

import { useWalletStore } from "~stores/walletStore"

const LoginView = () => {
    const [password, setPassword] = useState<string>("")
    const [alert, setAlert] = useState<string>("")
    const navigator = useNavigate()

    const onLogin = async () => {

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

export default LoginView