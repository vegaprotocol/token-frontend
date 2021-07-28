interface ClaimState {
  denomination: number | null; // amount
  target: string | null; // ETH address
  tranche_id: number | null;
  expiry: number | null; // timestamp in seconds
  signature: string | null;
  nonce: number | null;
}

export type ClaimAction = { type: "SET_DATA_FROM_URL"; data: ClaimState };

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
    default:
      return state;
  }
}

export const initialClaimState = {
  denomination: null,
  target: null,
  tranche_id: null,
  expiry: null,
  signature: null,
  nonce: null,
};
