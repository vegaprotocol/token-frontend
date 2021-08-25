import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import tokenAbi from "../abis/vega_token_abi.json";
import { addDecimal } from "../decimals";

export default class VegaTokenAbi {
  private web3: Web3;
  private contract: Contract;
  private decimals: number | null;

  constructor(web3: Web3, tokenAddress: string) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      tokenAbi as AbiItem[],
      tokenAddress
    );
    this.decimals = null;
  }

  async getTotalSupply(): Promise<BigNumber> {
    const res = await this.contract.methods.totalSupply().call();
    if (this.decimals === null) {
      await this.getDecimals();
    }
    const supply = new BigNumber(res);
    return new BigNumber(addDecimal(supply, this.decimals!));
  }

  async getDecimals(): Promise<number> {
    const res = await this.contract.methods.decimals().call();
    this.decimals = Number(res);
    return this.decimals;
  }
}
