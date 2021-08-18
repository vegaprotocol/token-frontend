import BigNumber from "bignumber.js";
import { Tranche } from "../vega-web3-types";
import { IVegaVesting } from "../../web3-utils";
import { getTranchesFromHistory } from "../tranche-helpers";
import Web3 from "web3";

const BASE_URL = "../mocks/vesting";

class MockedVesting implements IVegaVesting {
  private decimals: number;

  constructor(web3: Web3, vestingAddress: string, decimals: number) {
    this.decimals = decimals;
  }

  private async performFetch(url: string) {
    const res = await fetch(`${BASE_URL}/${url}`);
    return await res.json();
  }

  async getUserBalanceAllTranches(account: string): Promise<BigNumber> {
    const balance = await this.performFetch("balance");
    return new BigNumber(balance);
  }

  async getAllTranches(): Promise<Tranche[]> {
    const events = await this.performFetch("events");
    return getTranchesFromHistory(events, this.decimals);
  }
}

export default MockedVesting;
