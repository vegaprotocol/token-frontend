import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import tokenAbi from "../abis/vega_token_abi.json";

export default class VegaTokenAbi {
  private web3: Web3;
  private contract: Contract;

  constructor(web3: Web3, tokenAddress: string) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      tokenAbi as AbiItem[],
      tokenAddress
    );
  }

  async getTotalSupply(): Promise<BigNumber> {
    const res = await this.contract.methods.totalSupply().call();
    return new BigNumber(res);
  }

  async getDecimals(): Promise<number> {
    const res = await this.contract.methods.decimals().call();
    return Number(res);
  }
}
