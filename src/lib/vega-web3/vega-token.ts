import BN from "bn.js";
import { ethers } from "ethers";

import { BigNumber } from "../../lib/bignumber";
import tokenAbi from "../abis/vega_token_abi.json";
import { addDecimal, removeDecimal } from "../decimals";
import { IVegaToken } from "../web3-utils";

export default class VegaToken implements IVegaToken {
  private contract: ethers.Contract;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: ethers.Signer,
    tokenAddress: string
  ) {
    this.contract = new ethers.Contract(
      tokenAddress,
      tokenAbi,
      signer || provider
    );
  }

  async allowance(address: string, spender: string): Promise<BigNumber> {
    const decimals = await this.decimals();
    const res: BN = await this.contract.allowance(address, spender);
    return new BigNumber(addDecimal(new BigNumber(res.toString()), decimals));
  }

  async approve(spender: string): Promise<ethers.ContractTransaction> {
    const decimals = await this.decimals();
    const amount = removeDecimal(
      new BigNumber(Number.MAX_SAFE_INTEGER),
      decimals
    );
    return this.contract.approve(spender, amount);
  }

  async totalSupply(): Promise<BigNumber> {
    const decimals = await this.decimals();
    const res: BN = await this.contract.totalSupply();
    return new BigNumber(addDecimal(new BigNumber(res.toString()), decimals));
  }

  async decimals(): Promise<number> {
    const res: number = await this.contract.decimals();
    return Number(res);
  }

  async tokenData(): Promise<{ totalSupply: BigNumber; decimals: number }> {
    const [supply, decimals] = await Promise.all([
      this.totalSupply(),
      this.decimals(),
    ]);

    return {
      totalSupply: new BigNumber(addDecimal(supply, decimals)),
      decimals,
    };
  }

  async balanceOf(address: string): Promise<BigNumber> {
    const decimals = await this.decimals();
    const res: BN = await this.contract.balanceOf(address);
    return new BigNumber(addDecimal(new BigNumber(res.toString()), decimals));
  }
}
