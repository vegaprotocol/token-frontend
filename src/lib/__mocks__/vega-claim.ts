import { IVegaClaim, PromiEvent } from "../web3-utils";

class MockedVegaClaim implements IVegaClaim {
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
    throw new Error("Method not implemented.");
  }
  isExpired(expiry: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  isUsed(nonce: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  isCountryBlocked(country: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

export default MockedVegaClaim;
