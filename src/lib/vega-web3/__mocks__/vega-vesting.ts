import BigNumber from "bignumber.js";
import { Tranche } from "../vega-web3-types";
import { IVegaVesting } from "../../web3-utils";
import { getTranchesFromHistory } from "../tranche-helpers";

const BASE_URL = "../mocks/vesting";

class MockedVesting implements IVegaVesting {
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
    return getTranchesFromHistory(events);
  }
}

export default MockedVesting;
