import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import tokenAbi from "../abis/vega_token_abi.json";
import { addDecimal } from "../decimals";
import { IVegaToken, PromiEvent } from "../web3-utils";

export default class VegaToken implements IVegaToken {
  private web3: Web3;
  private contract: Contract;
  private tokenAddress: string;

  constructor(web3: Web3, tokenAddress: string) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      tokenAbi as AbiItem[],
      tokenAddress
    );
    this.tokenAddress = tokenAddress;
  }

  approve(address: string): PromiEvent {
    return this.contract.methods.approve(
      this.tokenAddress,
      Number.MAX_SAFE_INTEGER - 1
    );
  }

  async totalSupply(): Promise<BigNumber> {
    const res = await this.contract.methods.totalSupply().call();
    return new BigNumber(res);
  }

  async decimals(): Promise<number> {
    const res = await this.contract.methods.decimals().call();
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
    const res = await this.contract.methods.balanceOf(address).call();
    return new BigNumber(addDecimal(new BigNumber(res), decimals));
  }
}
