import { Tranche } from "../vega-web3/vega-web3-types";
import { IVegaVesting } from "../web3-utils";

class MockedVesting implements IVegaVesting {
  getUserBalanceAllTranches(account: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getAllTranches(): Promise<Tranche[]> {
    return Promise.resolve([]);
  }
}

export default MockedVesting;
