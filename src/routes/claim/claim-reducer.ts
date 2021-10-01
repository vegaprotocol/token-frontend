import { BigNumber } from "../../lib/bignumber";
import { addDecimal } from "../../lib/decimals";

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
  denominationFormatted: BigNumber; // amount formatted with decimal places
  target: string | null; // ETH address
  trancheId: number | null;
  expiry: number | null; // timestamp in seconds
  s: string | null;
  r: string | null;
  v: string | null;
  countryCode: string | null;
  loading: boolean;
  error: Error | null;
  claimStatus: ClaimStatus;
  commitTxHash: string | null;
  claimTxHash: string | null;
}

export const initialClaimState: ClaimState = {
  denomination: null,
  denominationFormatted: new BigNumber(0),
  target: null,
  trancheId: null,
  expiry: null,
  s: null,
  r: null,
  v: null,
  countryCode: null,
  loading: true,
  error: null,
  claimStatus: ClaimStatus.Ready,
  commitTxHash: null,
  claimTxHash: null,
};

export enum ClaimActionType {
  SET_DATA_FROM_URL,
  SET_INITIAL_CLAIM_STATUS,
  SET_CLAIM_STATUS,
  SET_LOADING,
  SET_COUNTRY,
  SET_COMMIT_TX_HASH,
  SET_CLAIM_TX_HASH,
  ERROR,
}

export type ClaimAction =
  | {
      type: ClaimActionType.SET_DATA_FROM_URL;
      decimals: number;
      data: {
        amount: string;
        trancheId: string;
        expiry: string;
        s: string;
        r: string;
        v: string;
        target: string;
      };
    }
  | {
      type: ClaimActionType.SET_INITIAL_CLAIM_STATUS;
      committed: boolean;
      expired: boolean;
      used: boolean;
    }
  | {
      type: ClaimActionType.SET_CLAIM_STATUS;
      status: ClaimStatus;
    }
  | {
      type: ClaimActionType.SET_LOADING;
      loading: boolean;
    }
  | {
      type: ClaimActionType.SET_COUNTRY;
      countryCode: string;
    }
  | {
      type: ClaimActionType.SET_COMMIT_TX_HASH;
      commitTxHash: string;
    }
  | {
      type: ClaimActionType.SET_CLAIM_TX_HASH;
      claimTxHash: string;
    }
  | {
      type: ClaimActionType.ERROR;
      error: Error;
    };

export function claimReducer(
  state: ClaimState,
  action: ClaimAction
): ClaimState {
  switch (action.type) {
    case ClaimActionType.SET_DATA_FROM_URL:
      // We need all of these otherwise the code is invalid
      if (
        // Do not need target as keys can be for the holder only
        !action.data.s ||
        !action.data.r ||
        !action.data.v ||
        !action.data.amount ||
        !action.data.expiry ||
        !action.data.trancheId
      ) {
        return {
          ...state,
          error: new Error("Invalid code"),
        };
      } else {
        const denomination = new BigNumber(action.data.amount);
        return {
          ...state,
          denomination,
          denominationFormatted: new BigNumber(
            addDecimal(denomination, Number(action.data.amount))
          ),
          target: action.data.target ?? null,
          trancheId: Number(action.data.trancheId),
          expiry: Number(action.data.expiry),
          s: action.data.s,
          r: action.data.r,
          v: action.data.v,
        };
      }
    case ClaimActionType.SET_INITIAL_CLAIM_STATUS:
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
    case ClaimActionType.SET_CLAIM_STATUS:
      return {
        ...state,
        claimStatus: action.status,
      };
    case ClaimActionType.SET_COUNTRY:
      return {
        ...state,
        countryCode: action.countryCode,
      };
    case ClaimActionType.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case ClaimActionType.SET_COMMIT_TX_HASH:
      return {
        ...state,
        commitTxHash: action.commitTxHash,
      };
    case ClaimActionType.SET_CLAIM_TX_HASH:
      return {
        ...state,
        claimTxHash: action.claimTxHash,
      };
    case ClaimActionType.ERROR:
      return {
        ...state,
        error: action.error,
      };
  }
}
