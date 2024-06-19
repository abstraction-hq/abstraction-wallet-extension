import { onMessage } from "webext-bridge/background"
import { handleRequest } from "./handler"

onMessage("api_call", handleRequest)