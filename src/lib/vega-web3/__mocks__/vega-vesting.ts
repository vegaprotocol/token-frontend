import { BigNumber } from "../../../lib/bignumber";
import { Tranche } from "../vega-web3-types";
import { IVegaVesting } from "../../web3-utils";
import { getTranchesFromHistory } from "../tranche-helpers";
import Web3 from "web3";
import { addDecimal } from "../../decimals";

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
      if (res.status !== 200) {
        throw new Error(
          "Endpoint sent non 200 status code. Usually this means that a mock has chosen to send a 500 back"
        );
      }
      return res.json();
    } else {
      const res = await fetch(`${BASE_URL}/${url}`);
      if (res.status !== 200) {
        throw new Error(
          "Endpoint sent non 200 status code. Usually this means that a mock has chosen to send a 500 back"
        );
      }
      return res.json();
    }
  }

  async getLien(address: string): Promise<BigNumber> {
    const balance = await this.performFetch(`balance/lien`);
    return new BigNumber(addDecimal(new BigNumber(balance), this.decimals));
  }

  async userTrancheTotalBalance(
    address: string,
    tranche: number
  ): Promise<BigNumber> {
    const balance = await this.performFetch(
      `tranches/${tranche}/balance/locked`,
      {
        address,
      }
    );
    return new BigNumber(addDecimal(new BigNumber(balance), this.decimals));
  }
  async userTrancheVestedBalance(
    address: string,
    tranche: number
  ): Promise<BigNumber> {
    const balance = await this.performFetch(
      `tranches/${tranche}/balance/vested`,
      {
        address,
      }
    );
    return new BigNumber(addDecimal(new BigNumber(balance), this.decimals));
  }

  async getUserBalanceAllTranches(account: string): Promise<BigNumber> {
    const balance = await this.performFetch("balance");
    return new BigNumber(addDecimal(new BigNumber(balance), this.decimals));
  }

  async getAllTranches(): Promise<Tranche[]> {
    const events = await this.performFetch("events");
    return getTranchesFromHistory(events, this.decimals);
  }
}

export default MockedVesting;
