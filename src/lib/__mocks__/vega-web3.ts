import type { Tranche } from "../vega-web3-types";
import { EthereumChainId } from "../vega-web3-utils";
import { generateTranches } from "./generate-tranche";

class VegaWeb3 {
  private chainId: EthereumChainId;

  constructor(chainId: EthereumChainId) {
    this.chainId = chainId;
  }

  async getAllTranches(): Promise<Tranche[]> {
    return Promise.resolve(generateTranches(10));
  }
}

export default VegaWeb3;
