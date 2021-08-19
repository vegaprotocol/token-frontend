import { BigNumber } from "../../../lib/bignumber";
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

  private async performFetch(url: string, data?: any) {
    if (data) {
      const res = await fetch(`${BASE_URL}/${url}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    } else {
      const res = await fetch(`${BASE_URL}/${url}`);
      return res.json();
    }
  }

  async userTrancheBalance(
    address: string,
    tranche: number
  ): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }
  userTrancheVested(address: string, tranche: number): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }
  userStakedBalance(address: string, vegaAddress: string): Promise<BigNumber> {
    throw new Error("Method not implemented.");
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
