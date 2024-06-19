import React, { useEffect } from "react"
import { PublicClient, createPublicClient, http } from "viem"
import { sendMessage } from "webext-bridge/popup"
import { NETWORKS } from "~constants"
import { useConfigStore, useWalletStore } from "~stores"
import { Account } from "~utils/account"
import { handleUserOp } from "~utils/bundler"

const SignTransaction = () => {
    const [transaction, setTransaction] = React.useState<any>(null)
    const activeWallet: number = useWalletStore((state) => state.activeWallet)
    const activeNetwork: string = useConfigStore((state) => state.activeNetwork)
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
        const account = new Account(wallets[activeWallet]?.signerAddress)
        
        const ethClient = createPublicClient({
            chain: NETWORKS[activeNetwork],
            transport: http()
        }) as PublicClient

        const [userOp, userOpHash] = await account.sendTransactionOperation(ethClient, [{
            target: transaction.to,
            value: transaction.value,
            data: transaction.data
        }])

        // TODO: sign transaction

        const txHash = await handleUserOp(userOp)

        sendMessage("signedTransaction", {
            userOp: userOp,
            userOpHash: userOpHash,
            txHash: txHash
        }, "background")
        window.close()
    }

    const onReject = async () => {
        sendMessage("signedTransaction", "reject", "background")
        window.close()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gray-100 border border-gray-200 p-4 rounded">
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
                onClick={onReject}>
                Reject
            </button>
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
