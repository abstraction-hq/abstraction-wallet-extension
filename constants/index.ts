import { defineChain } from "viem"

export const FACTORY_ADDRESS = "0x8Df152ecfd4b7Aa5a533acFA06303057C768A89D"
export const ENTRY_POINT_ADDRESS = "0xAEFDf152a3219B6011ACc4f382269B0FAFF3d35E"

export const vicTestnet = defineChain({
    id: 89,
    name: 'Viction Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Viction',
        symbol: 'VIC',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc-testnet.viction.xyz'],
            webSocket: ['wss://ws-testnet.viction.xyz'],
        },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://testnet.vicscan.xyz' },
    },
    testnet: true
})

export const NETWORKS: any = {
    "testnet": vicTestnet
}