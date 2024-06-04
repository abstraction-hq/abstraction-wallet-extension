import { Hex } from "viem";
import { RawUserOperation } from "@/hooks/types";
import axios from "axios";

export const getShortAddress = (address: Hex): Hex => {
    const prefixLength = 6;
    const suffixLength = 4;

    if (address.length <= prefixLength + suffixLength) {
        return address;
    }

    const prefix = address.slice(0, prefixLength);
    const suffix = address.slice(-suffixLength);

    return `${prefix}...${suffix}` as Hex;
}

export const handleUserOp = async (userOp: RawUserOperation): Promise<Hex> => {
    const url = 'http://localhost:4337/eth_sendUserOperation';
    const data = {
        userOp
    }
    const response = await axios.post(url, data)
    return response.data
}