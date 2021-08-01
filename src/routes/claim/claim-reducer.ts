import BN from "bn.js";

export interface ClaimState {
  // From URL
  denomination: BN | null; // amount
  target: string | null; // ETH address
  trancheId: number | null;
  expiry: number | null; // timestamp in seconds
  code: string | null;
  nonce: string | null;

  // generic
  error: Error | null;
}

export const initialClaimState: ClaimState = {
  denomination: null,
  target: null,
  trancheId: null,
  expiry: null,
  code: null,
  nonce: null,

  // generic
  error: null,
};

export type ClaimAction =
  | {
      type: "SET_DATA_FROM_URL";
      data: {
        denomination: string;
        target?: string;
        trancheId: string;
        expiry: string;
        code: string;
        nonce: string;
      };
    }
  | {
      type: "ERROR";
      error: Error;
    };

export function claimReducer(state: ClaimState, action: ClaimAction) {
  switch (action.type) {
    case "SET_DATA_FROM_URL":
      // We need all of these otherwise the code is invalid
      if (
        // Do not need target as keys can be for the holder only
        !action.data.denomination ||
        !action.data.trancheId ||
        !action.data.expiry ||
        !action.data.code ||
        !action.data.nonce
      ) {
        return {
          ...state,
          error: new Error("Invalid code"),
        };
      } else {
        return {
          ...state,
          denomination: new BN(action.data.denomination),
          target: action.data.target ?? null,
          trancheId: Number(action.data.trancheId),
          expiry: Number(action.data.expiry),
          code: action.data.code,
          nonce: action.data.nonce,
        };
      }
    case "ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
