import { Hex } from "viem";
import { create } from "zustand";

export const useAccount = create((set) => ({
    address: "0x",
    setAddress: (address: Hex) => set({ address }),
}));