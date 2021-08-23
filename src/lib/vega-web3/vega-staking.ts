import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import stakingAbi from "../abis/staking_abi.json";
import { PromiEvent } from "../web3-utils";
import { addDecimal } from "../decimals";

export default class StakingAbi {
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

  addStake(address: string, amount: string, vegaKey: string): PromiEvent {
    return this.contract.methods.stake(amount, vegaKey).send({ from: address });
  }

  removeStake(address: string, amount: string, vegaKey: string): PromiEvent {
    return this.contract.methods
      .remove_stake(amount, vegaKey)
      .send({ from: address });
  }

  transferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
  ): PromiEvent {
    return this.contract.methods
      .remove_stake(amount, newAddress, vegaKey)
      .send({ from: address });
  }

  async stakeBalance(address: string, vegaKey: string): Promise<BigNumber> {
    const res = await this.contract.methods
      .stake_balance(address, vegaKey)
      .call();
    return new BigNumber(addDecimal(new BigNumber(res), this.decimals));
  }

  async totalStaked(): Promise<BigNumber> {
    const res = await this.contract.methods.total_staked().call();
    return new BigNumber(addDecimal(new BigNumber(res), this.decimals));
  }
}
