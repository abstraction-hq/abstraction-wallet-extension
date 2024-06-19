import React, { useEffect, useState } from "react"
import { sendMessage } from "webext-bridge/popup"
import Auth from "~components/auth"

import { useDappStore } from "~stores/dappStore"
import { IDapp } from "~types/storages/types"

import "../style.css"

const Connect = () => {
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
            <div>
                Connect
                <img src={dappInfo.icon} alt={dappInfo.name} />
                <h1>{dappInfo.name}</h1>
                <p>{dappInfo.hostname}</p>
                <p>Would you like to connect?</p>
                <button onClick={onReject}>Reject</button>
                <button onClick={onConnect}>Accept</button>
            </div>
        </Auth>
    )
}

export default Connect
