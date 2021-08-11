import BigNumber from "bignumber.js";
import { Tranche } from "../vega-web3/vega-web3-types";
import { IVegaVesting } from "../web3-utils";
import trancheData from "./tranche-data.json";

const BASE_URL = "mocks/vesting";

class MockedVesting implements IVegaVesting {
  private async performFetch(url: string) {
    const res = await fetch(`${BASE_URL}/${url}`);
    return await res.json();
  }

  getUserBalanceAllTranches(account: string): Promise<BigNumber> {
    return Promise.resolve(new BigNumber(100000));
    // return this.performFetch(`balance`);
  }

  getAllTranches(): Promise<Tranche[]> {
    // TODO populate with events
    // @ts-ignore
    return Promise.resolve(
      trancheData.map((t) => ({
        ...t,
        tranche_id: Number(t.tranche_id),
        trance_start: new Date(t.tranche_start),
        trance_end: new Date(t.tranche_end),
        total_added: new BigNumber(t.total_added),
        total_removed: new BigNumber(t.total_removed),
        locked_amount: new BigNumber(t.locked_amount),
      }))
    );
  }
}

export default MockedVesting;
