import { Hex } from "viem";

export interface UserStorage {
    encryptedMnemonic: string;
    passwordHash: string;
}

export interface Wallet {
    name: string;
    index: number;
    address: Hex;
}

export type ActiveWallet = number;