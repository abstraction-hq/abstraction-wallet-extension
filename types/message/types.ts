export interface Response {
    callID: string
    type: "request" | "response",
    error?: boolean,
    message?: any
}