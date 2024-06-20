import React, { useEffect } from "react"
import { sendMessage } from "webext-bridge/popup"
import { useWalletStore } from "~stores"

const SignTransactionView = () => {
    const [transaction, setTransaction] = React.useState<any>(null)
    const activeWallet: number = useWalletStore((state) => state.activeWallet)
    const wallets = useWalletStore((state) => state.wallets)

    useEffect(() => {
        const fetchTransactionInfo = async () => {
            const txInfo = await sendMessage("requestTransactionInfo", null, "background")
            console.log(txInfo)
            setTransaction(txInfo)
        }
        fetchTransactionInfo()
    }, [])

    const onConfirm = async () => {
        sendMessage("signTransactionResult", "txHash", "background")
        window.close()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="">
                <h1 className="text-xl font-bold">Transaction Details</h1>
                <div className="py-2">
                    <span className="font-semibold">From:</span> {wallets[activeWallet]?.senderAddress}
                </div>
                <div className="py-2">
                    <span className="font-semibold">To:</span> {transaction?.to}
                </div>
                <div className="py-2">
                    <span className="font-semibold">Value:</span> {transaction?.value}
                </div>
                <div className="py-2">
                    <span className="font-semibold">Data:</span> {transaction?.value}
                </div>
            </div>
            <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={onConfirm}>
                Sign Transaction
            </button>
        </div>
    )
}

export default SignTransactionView
