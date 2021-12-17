import { ethers } from "ethers";

export class VegaContract {
  provider: ethers.providers.InfuraProvider | null = null;
  signer: ethers.Signer | null = null;

  constructor(
    provider?: ethers.providers.InfuraProvider,
    signer?: ethers.Signer
  ) {
    if (provider) {
      this.provider = provider;
    }

    if (signer) {
      this.signer = signer;
    }
  }

  setProvider(provider: ethers.providers.InfuraProvider) {
    this.provider = provider;
  }

  setSigner(signer: ethers.Signer) {
    this.signer = signer;
  }
}
