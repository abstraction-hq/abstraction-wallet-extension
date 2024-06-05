import { Hex } from "viem"
import { decryptMnemonic } from "./encryption"
import { mnemonicToAccount } from "viem/accounts"

export class Signer {
    private encryptedMnemonic: string
    private index: number

    constructor(encryptedMnemonic: string, index: number) {
        this.encryptedMnemonic = encryptedMnemonic
        this.index = index
    }

    public signUserOpHash = async (userOpHash: Hex, password: string): Promise<Hex> => {
        const mnemonic = await decryptMnemonic(this.encryptedMnemonic, password)
        const account = mnemonicToAccount(mnemonic, {
            addressIndex: this.index,
        })
        const signature = await account.signMessage({
            message: {
                raw: userOpHash,
            }
        })
        return signature
    }
}