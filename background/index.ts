import { onMessage } from "webext-bridge/background"
import APIHandler from "./apiHandler"

console.log("Background script running")

const handler = new APIHandler()

onMessage("api_call", handler.handleApi)
