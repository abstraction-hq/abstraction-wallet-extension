import React, { useEffect, useState } from "react"
import { sendMessage } from "webext-bridge/popup"
import Auth from "~components/auth"

import { useDappStore } from "~stores/dappStore"
import { IDapp } from "~types/storages/types"

import "~style.css"

const ConnectView = () => {
    const addDappPermission = useDappStore((state) => state.onAddPermission)
    const [dappInfo, setDappInfo] = useState<IDapp>({
        hostname: "",
        name: "",
        icon: ""
    })

    useEffect(() => {
        const fetchDappInfo = async () => {
            const dappInfo: any = await sendMessage(
                "requestDappInfo",
                null,
                "background"
            )
            setDappInfo(dappInfo as IDapp)
        }

        fetchDappInfo()
    }, [])

    const onConnect = async () => {
        console.log(dappInfo)
        addDappPermission(dappInfo.hostname, dappInfo, ["eth_accounts"])
        sendMessage("connect", ["eth_accounts"], "background")
        window.close()
    }

    const onReject = () => {
        sendMessage("connect", "reject", "background")
        window.close()
    }

    return (
        <Auth>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Connect</h1>
                <img className="w-16 h-16 mb-2" src={dappInfo.icon} alt={dappInfo.name} />
                <h2 className="text-xl font-semibold mb-2">{dappInfo.name}</h2>
                <p className="text-gray-500 mb-4">{dappInfo.hostname}</p>
                <p className="text-lg mb-4">Would you like to connect?</p>
                <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={onReject}>Reject</button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={onConnect}>Accept</button>
                </div>
            </div>
        </Auth>
    )
}

export default ConnectView
