import { BigNumber } from "../../../lib/bignumber";
import { IVegaClaim, WrappedPromiEvent } from "../../web3-utils";
import { promiEventFactory, uuidv4 } from "./promi-manager";

const BASE_URL = "mocks/claim";
class MockedVegaClaim implements IVegaClaim {
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

  commit(claimCode: string, account: string): WrappedPromiEvent<void> {
    return promiEventFactory(uuidv4(), "commit");
  }

  checkCommit(claimCode: string, account: string): Promise<any> {
    // TODO add test for if check fails
    return Promise.resolve(true);
  }

  claim({
    amount,
    tranche,
    expiry,
    target,
    country,
    v,
    r,
    s,
    account,
  }: {
    amount: BigNumber;
    tranche: number;
    expiry: number;
    target?: string;
    country: string;
    v: number;
    r: string;
    s: string;
    account: string;
  }): WrappedPromiEvent<void> {
    return promiEventFactory(uuidv4(), "claim");
  }

  checkClaim({
    amount,
    tranche,
    expiry,
    target,
    country,
    v,
    r,
    s,
    account,
  }: {
    amount: BigNumber;
    tranche: number;
    expiry: number;
    target?: string;
    country: string;
    v: number;
    r: string;
    s: string;
    account: string;
  }): Promise<any> {
    return Promise.resolve(true);
  }

  isCommitted({ s, account }: { s: string; account: string }): Promise<string> {
    return this.performFetch("committed");
  }

  isExpired(expiry: number): Promise<boolean> {
    return this.performFetch("expired", { expiry });
  }
  isUsed(nonce: string): Promise<boolean> {
    return this.performFetch("used");
  }
  isCountryBlocked(country: string): Promise<boolean> {
    return this.performFetch("blocked", country);
  }
}

export default MockedVegaClaim;
