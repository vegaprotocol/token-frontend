import { BigNumber } from "../../lib/bignumber";
import { ethers } from "ethers";
import tokenAbi from "../abis/vega_token_abi.json";
import { addDecimal } from "../decimals";
import { IVegaToken } from "../web3-utils";

export default class VegaToken implements IVegaToken {
  private provider: ethers.providers.Web3Provider;
  private contract: ethers.Contract;
  private tokenAddress: string;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: any,
    tokenAddress: string
  ) {
    this.provider = provider;
    this.contract = new ethers.Contract(
      tokenAddress,
      tokenAbi as any,
      signer || provider
    );
    this.tokenAddress = tokenAddress;
  }

  async allowance(address: string, spender: string): Promise<BigNumber> {
    const decimals = await this.decimals();
    const res = await this.contract.allowance(address, spender);
    return new BigNumber(addDecimal(new BigNumber(res.toString()), decimals));
  }

  // @ts-ignore
  async approve(
    address: string,
    spender: string
    // @ts-ignore
  ): Promise<undefined> {
    // ): Promise<WrappedPromiEvent<boolean>> {
    alert("TODO:");
    // const decimals = await this.decimals();
    // const amount = removeDecimal(
    //   new BigNumber(Number.MAX_SAFE_INTEGER),
    //   decimals
    // );
    // return {
    //   promiEvent: this.contract.methods
    //     .approve(spender, amount)
    //     .send({ from: address }),
    // };
  }

  async totalSupply(): Promise<BigNumber> {
    const decimals = await this.decimals();
    const res = await this.contract.totalSupply();
    return new BigNumber(addDecimal(new BigNumber(res.toString()), decimals));
  }

  async decimals(): Promise<number> {
    const res = await this.contract.decimals();
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
    const res = await this.contract.balanceOf(address);
    console.log(res);
    return new BigNumber(addDecimal(new BigNumber(res.toString()), decimals));
  }
}
