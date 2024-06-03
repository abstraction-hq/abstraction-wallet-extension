import React, { useEffect, useState } from "react"
import { Hex, PublicClient } from "viem"

import { AccountService } from "~account"
import { useWalletState } from "~states"

export const Home = () => {
    const [address, setAddress] = useState<Hex>("0x")
    const [balance, setBalance] = useState<string>("")
    const account: AccountService = useWalletState(
        (state: any) => state.account
    )
    const ethClient: PublicClient = useWalletState(
        (state: any) => state.ethClient
    )

    const fetchAddress = async () => {
        const address = await account.getSender()
        setAddress(address)
    }

    const fetchBalance = async () => {
        if (address != "0x") {
            const balance = await ethClient.getBalance({ address })
            setBalance(balance.toString())
        }
    }

    useEffect(() => {
        fetchAddress()
    }, [])

    useEffect(() => {
        fetchBalance()
    }, [address])

    return (
        <div className="p-6 max-w-sm mx-auto rounded-xl shadow-md flex items-center space-x-4">
            <div>
                <div className="font-medium">
                    Wallet address: {address}
                </div>
                <p className="text-gray-500">Wallet balance: {balance} VIC</p>
                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Send
                </button>
                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Receive
                </button>
            </div>
        </div>
    )
}
