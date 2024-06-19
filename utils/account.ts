import {
    Address,
    concat,
    encodeAbiParameters,
    encodeFunctionData,
    encodePacked,
    getContractAddress,
    Hex,
    keccak256,
    numberToHex,
    parseAbiParameters,
    PublicClient,
    zeroAddress
} from "viem"

import Entrypoint from "~assets/abis/Entrypoint.json"
import Factory from "~assets/abis/Factory.json"
import Wallet from "~assets/abis/Wallet.json"

import { ENTRY_POINT_ADDRESS, ERC1967ProxyCreationCode, FACTORY_ADDRESS, WALLET_IMPLEMENT_ADDRESS } from "../constants"
import { CallContractArgs, RawUserOperation, UserOperation } from "~types/account/types"

export const DEFAULT_USER_OP: UserOperation = {
    sender: zeroAddress,
    nonce: 0n,
    initCode: "0x",
    callData: "0x",
    callGasLimit: 1000000n,
    verificationGasLimit: 1000000n,
    preVerificationGas: 800000n,
    maxFeePerGas: 0n,
    maxPriorityFeePerGas: 0n,
    paymasterAndData: "0x",
    signature: "0x"
}

export class Account {
    signerAddress: Address

    address: Address = zeroAddress
    initCode: Hex | undefined
    nonceKey = 0n

    constructor(signerAddress: Address) {
        this.signerAddress = signerAddress
    }

    private calculateUserOpHash = (userOp: UserOperation, chainId: number) => {
        const packed = encodeAbiParameters(
            parseAbiParameters(
                "address, uint256, bytes32, bytes32, uint256, uint256, uint256, uint256, uint256, bytes32"
            ),
            [
                userOp.sender,
                userOp.nonce,
                keccak256(userOp.initCode),
                keccak256(userOp.callData),
                userOp.callGasLimit,
                userOp.verificationGasLimit,
                userOp.preVerificationGas,
                userOp.maxFeePerGas,
                userOp.maxPriorityFeePerGas,
                keccak256(userOp.paymasterAndData)
            ]
        )

        const enc = encodeAbiParameters(
            parseAbiParameters("bytes32, address, uint256"),
            [keccak256(packed), ENTRY_POINT_ADDRESS, BigInt(chainId)]
        )

        return keccak256(enc)
    }

    private getInitCode = async (client: PublicClient): Promise<Hex> => {
        if (this.initCode != undefined) {
            return this.initCode
        }
        const sender = this.getSender()
        const walletCode: string | undefined = await client.getBytecode(
            { address: sender }
        )
        if (walletCode != undefined) {
            this.initCode = "0x"
        } else {
            this.initCode = concat([
                FACTORY_ADDRESS,
                encodeFunctionData({
                    abi: Factory.abi,
                    functionName: "createWallet",
                    args: [this.signerAddress]
                })
            ])
        }

        return this.initCode
    }

    async getNonce(client: PublicClient): Promise<bigint> {
        const ret = (await client.readContract({
            address: ENTRY_POINT_ADDRESS,
            abi: Entrypoint.abi,
            functionName: "getNonce",
            args: [this.getSender(), this.nonceKey]
        })) as bigint

        return ret
    }

    private async getChainId(client: PublicClient): Promise<number> {
        return client.getChainId()
    }

    getSender = (): Address => {
        if (this.address == zeroAddress) {
            const salt = keccak256(encodeAbiParameters(parseAbiParameters("address key"), [this.signerAddress]));
            const initParameter = encodeAbiParameters(parseAbiParameters("address implement,bytes data"), [
                WALLET_IMPLEMENT_ADDRESS,
                encodeFunctionData({
                    abi: Wallet.abi,
                    functionName: "__Wallet_init",
                    args: [this.signerAddress]
                })
            ])
            this.address = getContractAddress({
                bytecode: encodePacked(["bytes", "bytes"], [ERC1967ProxyCreationCode, initParameter]),
                from: FACTORY_ADDRESS,
                opcode: "CREATE2",
                salt: salt
            })
        }

        return this.address
    }

    buildUserOperation = async (
        client: PublicClient,
        callData: Hex
    ): Promise<[RawUserOperation, Hex]> => {
        let userOp = DEFAULT_USER_OP
        const [sender, nonce, initCode, chainId] = await Promise.all([
            this.getSender(),
            this.getNonce(client),
            this.getInitCode(client),
            this.getChainId(client)
        ])

        userOp = {
            ...userOp,
            sender,
            nonce,
            initCode,
            callData
        }
        const userOpHash = this.calculateUserOpHash(userOp, chainId)

        return [this.toRawUserOperation(userOp), userOpHash]
    }

    toRawUserOperation = (userOp: UserOperation): RawUserOperation => {
        return {
            sender: userOp.sender,
            nonce: numberToHex(userOp.nonce),
            initCode: userOp.initCode,
            callData: userOp.callData,
            callGasLimit: numberToHex(userOp.callGasLimit),
            verificationGasLimit: numberToHex(userOp.verificationGasLimit),
            preVerificationGas: numberToHex(userOp.preVerificationGas),
            maxFeePerGas: numberToHex(userOp.maxFeePerGas),
            maxPriorityFeePerGas: numberToHex(userOp.maxPriorityFeePerGas),
            paymasterAndData: userOp.paymasterAndData,
            signature: userOp.signature
        }
    }

    addKeyOperation = async (
        client: PublicClient,
        key: Address
    ): Promise<[RawUserOperation, Hex]> => {
        const callData = encodeFunctionData({
            abi: Wallet.abi,
            functionName: "addKey",
            args: [key]
        })

        return this.buildUserOperation(client, callData)
    }

    removeKeyOperation = async (client: PublicClient, prevKey: Address, key: Address) => {
        const callData = encodeFunctionData({
            abi: Wallet.abi,
            functionName: "removeKey",
            args: [prevKey, key]
        })

        return this.buildUserOperation(client, callData)
    }

    sendTransactionOperation: any = async (
        client: PublicClient,
        args: CallContractArgs[]
    ): Promise<[RawUserOperation, Hex]> => {
        let callData: Hex = "0x"
        if (args.length == 1) {
            callData = encodeFunctionData({
                abi: Wallet.abi,
                functionName: "execute",
                args: [args[0].target, args[0].value, args[0].data]
            })
        } else if (args.length > 1) {
            const [targets, values, data] = args.reduce<
                [Address[], bigint[], Hex[]]
            >(
                (prev, curr) => {
                    prev[0].push(curr.target)
                    prev[1].push(curr.value)
                    prev[2].push(curr.data)

                    return prev
                },
                [[], [], []]
            )

            callData = encodeFunctionData({
                abi: Wallet.abi,
                functionName: "executeBatch",
                args: [targets, values, data]
            })
        }

        return this.buildUserOperation(client, callData)
    }
}
export const calculateSenderAddress = (signerAddress: Address): Address => {
        const salt = keccak256(encodeAbiParameters(parseAbiParameters("address key"), [signerAddress]));
        const initParameter = encodeAbiParameters(parseAbiParameters("address implement,bytes data"), [
            WALLET_IMPLEMENT_ADDRESS,
            encodeFunctionData({
                abi: Wallet.abi,
                functionName: "__Wallet_init",
                args: [signerAddress]
            })
        ])
        return getContractAddress({
            bytecode: encodePacked(["bytes", "bytes"], [ERC1967ProxyCreationCode, initParameter]),
            from: FACTORY_ADDRESS,
            opcode: "CREATE2",
            salt: salt
        })
}
