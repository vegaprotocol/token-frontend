import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import stakingAbi from "../abis/staking_abi.json";
import { IVegaStaking, PromiEvent } from "../web3-utils";
import { addDecimal, removeDecimal } from "../decimals";

export default class StakingAbi implements IVegaStaking {
  private web3: Web3;
  private contract: Contract;
  private decimals: number;

  constructor(web3: Web3, claimAddress: string, decimals: number) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      stakingAbi as AbiItem[],
      claimAddress
    );
    this.decimals = decimals;
  }

  checkAddStake(
    address: string,
    amount: string,
    vegaKey: string
  ): Promise<any> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.methods
      .stake(convertedAmount, `0x${vegaKey}`)
      .call({ from: address });
  }

  addStake(address: string, amount: string, vegaKey: string): PromiEvent<void> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.methods
      .stake(convertedAmount, `0x${vegaKey}`)
      .send({ from: address });
  }

  checkRemoveStake(
    address: string,
    amount: string,
    vegaKey: string
  ): Promise<any> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.methods
      .stake(convertedAmount, `0x${vegaKey}`)
      .call({ from: address });
  }

  removeStake(address: string, amount: string, vegaKey: string): PromiEvent<void> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.methods
      .remove_stake(convertedAmount, `0x${vegaKey}`)
      .send({ from: address });
  }

  checkTransferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
  ): Promise<any> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.methods
      .remove_stake(convertedAmount, newAddress, `0x${vegaKey}`)
      .call({ from: address });
  }

  transferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
  ): PromiEvent<string> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.methods
      .remove_stake(convertedAmount, newAddress, `0x${vegaKey}`)
      .send({ from: address });
  }

  async stakeBalance(address: string, vegaKey: string): Promise<BigNumber> {
    const res = await this.contract.methods
      .stake_balance(address, `0x${vegaKey}`)
      .call();
    return new BigNumber(addDecimal(new BigNumber(res), this.decimals));
  }

  async totalStaked(): Promise<BigNumber> {
    const res = await this.contract.methods.total_staked().call();
    return new BigNumber(addDecimal(new BigNumber(res), this.decimals));
  }
}
