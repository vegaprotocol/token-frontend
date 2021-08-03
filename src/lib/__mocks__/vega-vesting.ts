import { Tranche } from "../vega-web3/vega-web3-types";
import { IVegaVesting } from "../web3-utils";
import trancheData from "./tranche-data.json";

class MockedVesting implements IVegaVesting {
  getUserBalanceAllTranches(account: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getAllTranches(): Promise<Tranche[]> {
    // TODO populate with events
    // @ts-ignore
    return Promise.resolve(trancheData);
  }
}

export default MockedVesting;
