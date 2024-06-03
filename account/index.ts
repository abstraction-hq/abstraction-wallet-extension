import { PublicClient, Address, zeroAddress, concat, Hex, encodeFunctionData, encodeAbiParameters, parseAbiParameters, keccak256, Account as Signer, numberToHex } from "viem"
import { FACTORY_ADDRESS, ENTRY_POINT_ADDRESS } from "../constants";

import Factory from "../assets/abis/Factory.json";
import Wallet from "../assets/abis/Wallet.json";
import Entrypoint from "../assets/abis/Entrypoint.json";
import { CallContractArgs, RawUserOperation, UserOperation } from "./types";

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
    signature: "0x",
};

export class AccountService {
    ethClient: PublicClient
    signer: Signer

    address: Address = zeroAddress
    initCode: Hex | undefined
    nonceKey = 0n;

    constructor(signer: Signer, ethClient: PublicClient) {
        this.ethClient = ethClient
        this.signer = signer
    }

    private calculateUserOpHash = (userOp: UserOperation, chainId: number) => {
        const packed = encodeAbiParameters(
          parseAbiParameters(
            "address, uint256, bytes32, bytes32, uint256, uint256, uint256, uint256, uint256, bytes32",
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
            keccak256(userOp.paymasterAndData),
          ],
        );
      
        const enc = encodeAbiParameters(
          parseAbiParameters("bytes32, address, uint256"),
          [keccak256(packed), ENTRY_POINT_ADDRESS, BigInt(chainId)],
        );
      
        return keccak256(enc);
      };

    private getInitCode = async (): Promise<Hex> => {
        if (this.initCode != undefined) {
            return this.initCode
        }
        const sender = await this.getSender()
        const walletCode: string | undefined = await this.ethClient.getBytecode({ address: sender });
        if (walletCode != undefined) {
            this.initCode = "0x"
        } else {
            this.initCode = concat([
                FACTORY_ADDRESS,
                encodeFunctionData({
                    abi: Factory.abi,
                    functionName: "createWallet",
                    args: [this.signer.address]
                })
            ])

        }

        return this.initCode
    }

    async getNonce(): Promise<bigint> {
        const ret = (await this.ethClient.readContract({
            address: ENTRY_POINT_ADDRESS,
            abi: Entrypoint.abi,
            functionName: "getNonce",
            args: [await this.getSender(), this.nonceKey],
        })) as bigint;

        return ret
    }

    private async getChainId(): Promise<number> {
        return this.ethClient.getChainId();
    }

    getSender = async (): Promise<Address> => {
        if (this.address == zeroAddress) {
            this.address = await this.ethClient.readContract({
                address: FACTORY_ADDRESS,
                abi: Factory.abi,
                functionName: "getWalletAddress",
                args: [this.signer.address]
            }) as Address
        }

        return this.address
    }

    buildUserOperation = async (callData: Hex): Promise<[RawUserOperation, Hex]> => {
        let userOp = DEFAULT_USER_OP
        const [sender, nonce, initCode, chainId] = await Promise.all([
            this.getSender(),
            this.getNonce(),
            this.getInitCode(),
            this.getChainId(),
        ])

        userOp = {
            ...userOp,
            sender,
            nonce,
            initCode,
            callData
        }
        const userOpHash = this.calculateUserOpHash(userOp, chainId)

        if (this.signer.signMessage) {
            userOp = {
                ...userOp,
                signature: concat([
                    this.signer.address,
                    await this.signer.signMessage({
                        message: {
                            raw: userOpHash
                        }
                    })
                ])
            }
        }

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
            signature: userOp.signature,
        };
    };

    addKeyOperation = async (key: Address): Promise<[RawUserOperation, Hex]> => {
        const callData = encodeFunctionData({
            abi: Wallet.abi,
            functionName: "addKey",
            args: [key]
        })

        return this.buildUserOperation(callData)
    }

    removeKeyOperation = async (prevKey: Address, key: Address) => {
        const callData = encodeFunctionData({
            abi: Wallet.abi,
            functionName: "removeKey",
            args: [prevKey, key]
        })

        return this.buildUserOperation(callData)
    }

    sendTransactionOperation: any = async (args: CallContractArgs[]): Promise<[RawUserOperation, Hex]> => {
        let callData: Hex = "0x"
        if (args.length == 1) {
            callData = encodeFunctionData({
                abi: Wallet.abi,
                functionName: "execute",
                args: [args[0].target, args[0].value, args[0].data]
            })
        } else if (args.length > 1) {
            const [targets, values, data] = args.reduce<[Address[], bigint[], Hex[]]>((prev, curr) => {
                prev[0].push(curr.target)
                prev[1].push(curr.value)
                prev[2].push(curr.data)

                return prev
            }, [[], [], []])

            callData = encodeFunctionData({
                abi: Wallet.abi,
                functionName: "executeBatch",
                args: [targets, values, data]
            })
        }

        return this.buildUserOperation(callData)
    }
}