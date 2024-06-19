import React, { useEffect, useState } from "react"
import { sendMessage } from "webext-bridge/popup"
import { useDappStore } from "~stores/dappStore"
import { IDapp } from "~types/storages/types"

const Connect = () => {
    const addDappPermission = useDappStore(state => state.onAddPermission)
    const [dappInfo, setDappInfo] = useState<IDapp>({
        hostname: "",
        name: "",
        icon: ""
    })

    useEffect(() => {
        const fetchDappInfo = async () => {
            const dappInfo: any = await sendMessage("requestDappInfo", null, "background")
            console.log(dappInfo)
            setDappInfo(dappInfo as IDapp)
        }

        fetchDappInfo()
    }, [])
    
    const onConnect = async () => {
        addDappPermission(dappInfo.hostname, dappInfo, ["eth_accounts"])
        sendMessage("connect", ["eth_account"], "background")
        window.close()
    }

    const onReject = () => {
        sendMessage("connect", "reject", "background")
        window.close()
    }

    return <div>
        Connect
        <img src={dappInfo.icon} alt={dappInfo.name} />
        <h1>{dappInfo.name}</h1>
        <p>{dappInfo.hostname}</p>
        <p>Would you like to connect?</p>
        <button onClick={onReject}>Reject</button>
        <button onClick={onConnect}>Accept</button>
    </div>
}

export default Connect