import { IVegaClaim, PromiEvent } from "../web3-utils";

const BASE_URL = "mocks/claim";
class MockedVegaClaim implements IVegaClaim {
  private async performFetch(url: string) {
    const res = await fetch(`${BASE_URL}/${url}`);
    return await res.json();
  }

  commit(claimCode: string, account: string): PromiEvent {
    throw new Error("Method not implemented.");
  }
  claim({
    claimCode,
    denomination,
    trancheId,
    expiry,
    nonce,
    country,
    targeted,
    account,
  }: {
    claimCode: string;
    denomination: import("bn.js");
    trancheId: number;
    expiry: number;
    nonce: string;
    country: string;
    targeted: boolean;
    account: string;
  }): PromiEvent {
    throw new Error("Method not implemented.");
  }

  isCommitted({
    claimCode,
    account,
  }: {
    claimCode: string;
    account: string;
  }): Promise<boolean> {
    return this.performFetch("committed");
  }
  isExpired(expiry: number): Promise<boolean> {
    return this.performFetch("expired");
  }
  isUsed(nonce: string): Promise<boolean> {
    return this.performFetch("used");
  }
  isCountryBlocked(country: string): Promise<boolean> {
    return this.performFetch("blocked");
  }
}

export default MockedVegaClaim;
