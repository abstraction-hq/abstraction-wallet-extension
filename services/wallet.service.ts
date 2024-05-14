export class WalletService {
    constructor(
        public walletAddress: string
    ) {
    }

    getAddress() {
        return this.walletAddress;
    }
}
