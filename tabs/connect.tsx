import React from "react"
import { sendMessage } from "webext-bridge/popup"

const Connect = () => {
    const onConnect = () => {
        sendMessage("connect", "accept")
        window.close()
    }
    return <div>
        Connect
        <button onClick={onConnect}>Connect</button>
    </div>
}

export default Connect