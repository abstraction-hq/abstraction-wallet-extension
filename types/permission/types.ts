export interface Caveat {
    type: string
    value: any
}

export interface Permission {
    invoker: string
    parentCapability: string
    caveats: Caveat[]
}
