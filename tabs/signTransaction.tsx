import React, { useEffect } from "react"
import { onMessage, sendMessage } from "webext-bridge/popup"

const SignTransaction = () => {
    useEffect(() => {
        onMessage("signTransaction", (data: any) => {
            console.log(data)
        })
        sendMessage("ready-for-transaction", null, "background")
    })

    const onConfirm = async () => {
        sendMessage("signedTransaction", "sign-transaction", "background")
        window.close()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={onConfirm}>
                Sign Transaction
            </button>
        </div>
    )
}

export default SignTransaction
