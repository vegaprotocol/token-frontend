import React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useSearchParams } from "../../hooks/use-search-params";
import { ClaimError } from "./claim-error";
import {
  ClaimActionType,
  claimReducer,
  ClaimStatus,
  initialClaimState,
} from "./claim-reducer";
import { ClaimFlow } from "./claim-flow";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { useRefreshBalances } from "../../hooks/use-refresh-balances";
import { useGetUserTrancheBalances } from "../../hooks/use-get-user-tranche-balances";

const Claim = ({
  address,
  tranches,
}: {
  address: string;
  tranches: Tranche[];
}) => {
  const params = useSearchParams();
  const { appState } = useAppState();
  const [state, dispatch] = React.useReducer(claimReducer, initialClaimState);
  const getUserTrancheBalances = useGetUserTrancheBalances(address);
  const refreshBalances = useRefreshBalances(address);
  React.useEffect(() => {
    dispatch({
      type: ClaimActionType.SET_DATA_FROM_URL,
      decimals: appState.decimals,
      data: {
        nonce: params.n,
        trancheId: params.t,
        expiry: params.ex,
        target: params.targ,
        denomination: params.d,
        code: params.r,
      },
    });
  }, [appState.decimals, dispatch, params]);

  // If the claim has been committed refetch the new VEGA balance
  React.useEffect(() => {
    if (state.claimStatus === ClaimStatus.Finished && address) {
      getUserTrancheBalances();
      refreshBalances();
    }
  }, [address, getUserTrancheBalances, refreshBalances, state.claimStatus]);

  if (state.error) {
    return <ClaimError />;
  }

  if (state.code) {
    return (
      <ClaimFlow
        state={state}
        dispatch={dispatch}
        address={address}
        tranches={tranches}
      />
    );
  }

  return null;
};

export default Claim;
