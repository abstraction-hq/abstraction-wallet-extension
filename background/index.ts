import { onMessage } from "webext-bridge/background"
import { handleRequest, onExtensionInstalled } from "./handler"
import browser from "webextension-polyfill"

onMessage("api_call", handleRequest)

// browser.runtime.onInstalled.addListener(onExtensionInstalled);