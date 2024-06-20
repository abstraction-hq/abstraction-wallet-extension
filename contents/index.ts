import { PlasmoCSConfig } from "plasmo"
import injectedScript from "url:./injectedScript"
import { onMessage, sendMessage } from "webext-bridge/content-script"

export const config: PlasmoCSConfig = {
    matches: ["file://*/*", "http://*/*", "https://*/*"],
    run_at: "document_start",
    all_frames: true
}

const container = document.head || document.documentElement
const script = document.createElement("script")

script.setAttribute("async", "false")
script.setAttribute("type", "text/javascript")
script.setAttribute("src", injectedScript)

container.insertBefore(script, container.children[0])
container.removeChild(script)

window.addEventListener("message", async ({ data }: any) => {
    // verify that the call has an ID
    if (data.type === "response" || data.type === "event") {
        return
    }
    if (!data.callID) {
        throw new Error("The call does not have a callID")
    }

    // send call to the background
    const res = await sendMessage(
        "api_call",
        data,
        "background"
    )

    // send the response to the injected script
    window.postMessage(res, window.location.origin)
})

onMessage("accountsChanged", async (data: any) => {
    const res = {
        type: "event",
        event: "accountsChanged",
        message: data
    }

    window.postMessage(res, window.location.origin)
})
