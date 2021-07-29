export enum TxState {
  Default,
  Requested,
  Pending,
  Complete,
  Error,
}

export interface ClaimState {
  // claim form state
  claimTxState: TxState;
  claimTxData: {
    hash: string | null;
    receipt: object | null;
    error: Error | null;
  };

  // From URL
  denomination: number | null; // amount
  target: string | null; // ETH address
  trancheId: number | null;
  expiry: number | null; // timestamp in seconds
  code: string | null;
  nonce: number | null;

  // generic
  error: Error | null;
}

export const initialClaimState: ClaimState = {
  // claim tx
  claimTxState: TxState.Default,
  claimTxData: {
    hash: null,
    receipt: null,
    error: null,
  },

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
      type: "CLAIM_TX_REQUESTED";
    }
  | {
      type: "CLAIM_TX_SUBMITTED";
      txHash: string;
    }
  | {
      type: "CLAIM_TX_COMPLETE";
      receipt: any;
    }
  | {
      type: "CLAIM_TX_ERROR";
      error: Error;
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
          denomination: Number(action.data.denomination),
          target: action.data.target ?? null,
          trancheId: Number(action.data.trancheId),
          expirty: Number(action.data.expiry),
          code: action.data.code,
          nonce: Number(action.data.code),
        };
      }
    case "CLAIM_TX_REQUESTED":
      return {
        ...state,
        claimTxState: TxState.Requested,
      };
    case "CLAIM_TX_SUBMITTED": {
      return {
        ...state,
        claimTxState: TxState.Pending,
        claimTxData: {
          ...state.claimTxData,
          hash: action.txHash,
        },
      };
    }
    case "CLAIM_TX_COMPLETE":
      return {
        ...state,
        claimTxState: TxState.Complete,
        claimTxData: {
          ...state.claimTxData,
          receipt: action.receipt,
        },
      };
    case "CLAIM_TX_ERROR":
      return {
        ...state,
        claimTxState: TxState.Error,
        claimTxData: {
          ...state.claimTxData,
          error: action.error,
        },
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
