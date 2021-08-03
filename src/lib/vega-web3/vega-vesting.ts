import Web3 from "web3";
import type { Contract } from "web3-eth-contract";
import vestingAbi from "../abis/vesting_abi.json";
import { IVegaVesting } from "../web3-utils";
import { getTranchesFromHistory } from "./tranche-helpers";
import { Tranche } from "./vega-web3-types";

export default class VegaVesting implements IVegaVesting {
  private web3: Web3;
  private contract: Contract;

  constructor(web3: Web3, vestingAddress: string) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      // @ts-ignore
      vestingAbi,
      vestingAddress
    );
  }

  async getUserBalanceAllTranches(account: string): Promise<string> {
    return this.contract.methods.user_total_all_tranches(account).call();
  }

  async getAllTranches(): Promise<Tranche[]> {
    const events = await this.contract.getPastEvents("allEvents", {
      fromBlock: 0,
      toBlock: "latest",
    });
    return getTranchesFromHistory(events);
  }
}
