import React, { useEffect, useState } from "react";
import { Hex, PublicClient } from "viem";
import { AccountService } from "~account";
import { useWalletState } from "~states";

export const Home = () => {
    const [address, setAddress] = useState<Hex>("0x");
    const [balance, setBalance] = useState<string>("");
    const account: AccountService = useWalletState((state: any) => state.account)
    const ethClient: PublicClient = useWalletState((state: any) => state.ethClient)

    const fetchAddress = async () => {
        const address = await account.getSender()
        setAddress(address);
    }

    const fetchBalance = async () => {
        if (address != "0x") {
            const balance = await ethClient.getBalance({address})
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
        <div>
            <div>Wallet address: {address}</div>
            <div>Wallet balance: {balance} VIC</div>
        </div>
    )
}