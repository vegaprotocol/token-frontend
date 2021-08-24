import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import vestingAbi from "../abis/vesting_abi.json";
import { IVegaVesting, PromiEvent } from "../web3-utils";
import { getTranchesFromHistory } from "./tranche-helpers";
import { Tranche } from "./vega-web3-types";
import { addDecimal } from "../decimals";

export default class VegaVesting implements IVegaVesting {
  private web3: Web3;
  private contract: Contract;
  private decimals: number;

  constructor(web3: Web3, vestingAddress: string, decimals: number) {
    this.decimals = decimals;
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      vestingAbi as AbiItem[],
      vestingAddress
    );
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

  checkRemoveStake(
    address: string,
    amount: string,
    vegaKey: string
  ): Promise<any> {
    return this.contract.methods.stake(amount, vegaKey).call({ from: address });
  }

  removeStake(address: string, amount: string, vegaKey: string): PromiEvent {
    return this.contract.methods
      .remove_stake(amount, `0x${vegaKey}`)
      .send({ from: address });
  }

  addStake(address: string, amount: string, vegaKey: string): PromiEvent {
    return this.contract.methods
      .stake_tokens(amount, `0x${vegaKey}`)
      .call({ from: address });
  }

  checkAddStake(
    address: string,
    amount: string,
    vegaKey: string
  ): Promise<any> {
    return this.contract.methods
      .stake_tokens(amount, `0x${vegaKey}`)
      .call({ from: address });
  }

  async getLien(address: string): Promise<BigNumber> {
    const { lien } = await this.contract.methods.user_stats(address).call();
    return new BigNumber(addDecimal(new BigNumber(lien), this.decimals));
  }

  async userTrancheTotalBalance(
    address: string,
    tranche: number
  ): Promise<BigNumber> {
    const amount = await this.contract.methods
      .get_tranche_balance(address, tranche)
      .call();
    return new BigNumber(addDecimal(new BigNumber(amount), this.decimals));
  }

  async userTrancheVestedBalance(
    address: string,
    tranche: number
  ): Promise<BigNumber> {
    const amount = await this.contract.methods
      .get_vested_for_tranche(address, tranche)
      .call();
    return new BigNumber(addDecimal(new BigNumber(amount), this.decimals));
  }

  async getUserBalanceAllTranches(account: string): Promise<BigNumber> {
    const amount = await this.contract.methods
      .user_total_all_tranches(account)
      .call();
    return new BigNumber(addDecimal(new BigNumber(amount), this.decimals));
  }

  async getAllTranches(): Promise<Tranche[]> {
    const events = await this.contract.getPastEvents("allEvents", {
      fromBlock: 0,
      toBlock: "latest",
    });
    return getTranchesFromHistory(events, this.decimals);
  }

  withdrawFromTranche(account: string, trancheId: number): PromiEvent {
    return this.contract.methods
      .withdraw_from_tranche(trancheId)
      .send({ from: account });
  }

  checkWithdrawFromTranche(account: string, trancheId: number): Promise<any> {
    return this.contract.methods
      .withdraw_from_tranche(trancheId)
      .call({ from: account });
  }
}
