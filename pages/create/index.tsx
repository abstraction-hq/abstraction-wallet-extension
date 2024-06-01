import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { english, generateMnemonic } from "viem/accounts"
import { useWalletState } from "~states"

import { initWallet } from "~wallets"

export const Create = () => {
	const [generatedMnemonic, setGeneratedMnemonic] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")

	const setWalletState = useWalletState((state: any) => state.setWalletState)

	const [alert, setAlert] = useState("")

	const navigator = useNavigate()

	useEffect(() => {
		const mnemonic = generateMnemonic(english)
		setGeneratedMnemonic(mnemonic)
	}, [])

	useEffect(() => {
        setAlert("")
	}, [confirmPassword])

	const onCreateWallet = async () => {
        if (password != confirmPassword) {
            setAlert("password mismatch")
        } else {
			await initWallet(generatedMnemonic, password)
			setWalletState("testnet", generatedMnemonic, 0)
			navigator("/home")
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
					) : <></>}
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
