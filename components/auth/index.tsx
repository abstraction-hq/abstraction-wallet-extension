import React, { useEffect, useState } from "react"
import { useAuthStore, useUserStore } from "~stores"
import { openTab } from "~utils/browser"
import { hashPassword } from "~utils/encryption"

const Auth = ({children}: any) => {
    const [password, setPassword] = useState<string>("")
    const [alert, setAlert] = useState<string>("")
    const isUnlocked = useAuthStore((state) => state.isUnlocked)
    const unlock = useAuthStore((state) => state.onUnlock)
    const credentials = useUserStore((state) => state.credentials)
    
    useEffect(() => {
        console.log(credentials)
        if (useUserStore.persist.hasHydrated() && !credentials) {
            openTab("welcome.html")
            window.close()
        }
    }, [credentials])

    const onLogin = async () => {
        if (password.length === 0) {
            setAlert("Password is required")
            return
        } 

        const passwordHash = hashPassword(password)
        if (passwordHash != credentials?.password) {
            setAlert("Password is incorrect")
            return
        }

        unlock(password)
    }

    if (isUnlocked) {
        return <>{children}</>
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

export default Auth