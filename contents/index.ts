import { PlasmoCSConfig } from "plasmo"
import injectedScript from "url:./injectedScript"

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