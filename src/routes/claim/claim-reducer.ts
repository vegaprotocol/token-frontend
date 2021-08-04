import Web3 from "web3";
import { BigNumber } from "../../lib/bignumber";

export enum ClaimStatus {
  Ready,
  Committed,
  Expired,
  Used,
  Finished,
}

export interface ClaimState {
  // From URL
  denomination: BigNumber | null; // amount
  target: string | null; // ETH address
  trancheId: number | null;
  expiry: number | null; // timestamp in seconds
  code: string | null;
  nonce: string | null;
  countryCode: string | null;
  loading: boolean;
  error: Error | null;
  claimStatus: ClaimStatus;
}

export const initialClaimState: ClaimState = {
  denomination: null,
  target: null,
  trancheId: null,
  expiry: null,
  code: null,
  nonce: null,
  countryCode: null,
  loading: true,
  error: null,
  claimStatus: ClaimStatus.Ready,
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
      type: "SET_INITIAL_CLAIM_STATUS";
      committed: boolean;
      expired: boolean;
      used: boolean;
    }
  | {
      type: "SET_CLAIM_STATUS";
      status: ClaimStatus;
    }
  | {
      type: "SET_LOADING";
      loading: boolean;
    }
  | {
      type: "SET_COUNTRY";
      countryCode: string;
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
          denomination: new BigNumber(
            Web3.utils.fromWei(action.data.denomination)
          ),
          target: action.data.target ?? null,
          trancheId: Number(action.data.trancheId),
          expiry: Number(action.data.expiry),
          code: action.data.code,
          nonce: action.data.nonce,
        };
      }
    case "SET_INITIAL_CLAIM_STATUS":
      let status = ClaimStatus.Ready;

      if (action.committed) {
        status = ClaimStatus.Committed;
      } else if (action.used) {
        status = ClaimStatus.Used;
      } else if (action.expired) {
        status = ClaimStatus.Expired;
      }

      return {
        ...state,
        claimStatus: status,
      };
    case "SET_CLAIM_STATUS":
      return {
        ...state,
        claimStatus: action.status,
      };
    case "SET_COUNTRY":
      return {
        ...state,
        countryCode: action.countryCode,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
