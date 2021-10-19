import { BigNumber } from "../../lib/bignumber";
import { ethers } from "ethers";
import { AbiItem } from "web3-utils";
import stakingAbi from "../abis/staking_abi.json";
import { IVegaStaking, WrappedPromiEvent } from "../web3-utils";
import { addDecimal, removeDecimal } from "../decimals";

export default class StakingAbi implements IVegaStaking {
  private provider: ethers.providers.Web3Provider;
  private contract: ethers.Contract;
  private decimals: number;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: any,
    address: string,
    decimals: number
  ) {
    this.provider = provider;
    this.contract = new ethers.Contract(
      address,
      // @ts-ignore
      stakingAbi as AbiItem[],
      signer || provider
    );
    this.decimals = decimals;
  }

  checkAddStake(
    address: string,
    amount: string,
    vegaKey: string
    // @ts-ignore
  ): Promise<any> {
    // const convertedAmount = removeDecimal(
    //   new BigNumber(amount),
    //   this.decimals
    // ).toString();
    // return this.contract.methods
    //   .stake(convertedAmount, `0x${vegaKey}`)
    //   .call({ from: address });
  }

  addStake(
    amount: string,
    vegaKey: string
    // @ts-ignore
  ): Promise<any> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.stake(convertedAmount, `0x${vegaKey}`);
  }

  checkRemoveStake(
    address: string,
    amount: string,
    vegaKey: string
    // @ts-ignore
  ): Promise<any> {
    // const convertedAmount = removeDecimal(
    //   new BigNumber(amount),
    //   this.decimals
    // ).toString();
    // return this.contract.methods
    //   .stake(convertedAmount, `0x${vegaKey}`)
    //   .call({ from: address });
  }

  removeStake(amount: string, vegaKey: string): Promise<any> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.remove_stake(convertedAmount, `0x${vegaKey}`);
    // return {
    //   promiEvent: this.contract.methods
    //     .remove_stake(convertedAmount, `0x${vegaKey}`)
    //     .send({ from: address }),
    // };
  }

  checkTransferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
    // @ts-ignore
  ): Promise<any> {
    // const convertedAmount = removeDecimal(
    //   new BigNumber(amount),
    //   this.decimals
    // ).toString();
    // return this.contract.methods
    //   .remove_stake(convertedAmount, newAddress, `0x${vegaKey}`)
    //   .call({ from: address });
  }

  transferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
    // @ts-ignore
  ): WrappedPromiEvent<string> {
    // const convertedAmount = removeDecimal(
    //   new BigNumber(amount),
    //   this.decimals
    // ).toString();
    // return {
    //   promiEvent: this.contract.methods
    //     .remove_stake(convertedAmount, newAddress, `0x${vegaKey}`)
    //     .send({ from: address }),
    // };
  }

  // @ts-ignore
  async stakeBalance(address: string, vegaKey: string): Promise<BigNumber> {
    // const res = await this.contract.methods
    //   .stake_balance(address, `0x${vegaKey}`)
    //   .call();
    // return new BigNumber(addDecimal(new BigNumber(res), this.decimals));
  }

  async totalStaked(): Promise<BigNumber> {
    const res = await this.contract.total_staked();
    return new BigNumber(
      addDecimal(new BigNumber(res.toString()), this.decimals)
    );
  }
}
