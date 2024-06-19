export interface Response {
    callID: string
    type: "response",
    error?: boolean,
    message?: any
}