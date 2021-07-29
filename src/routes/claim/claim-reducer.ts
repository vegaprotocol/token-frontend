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
  tranche_id: number | null;
  expiry: number | null; // timestamp in seconds
  signature: string | null;
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
  tranche_id: null,
  expiry: null,
  signature: null,
  nonce: null,

  // generic
  error: null,
};

export type ClaimAction =
  | {
      type: "SET_DATA_FROM_URL";
      data: {
        denomination: string;
        target: string;
        tranche_id: string;
        expiry: string;
        signature: string;
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
      return {
        ...state,
        denomination: action.data.denomination
          ? Number(action.data.denomination)
          : null,
        target: action.data.target ?? null,
        tranche_id: action.data.tranche_id
          ? Number(action.data.tranche_id)
          : null,
        expirty: action.data.expiry ? Number(action.data.expiry) : null,
        signature: action.data.signature ?? null,
        nonce: action.data.signature ? Number(action.data.signature) : null,
      };
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
