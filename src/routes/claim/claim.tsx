import React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useSearchParams } from "../../hooks/use-search-params";
import { ClaimError } from "./claim-error";
import { claimReducer, ClaimStatus, initialClaimState } from "./claim-reducer";
import { ClaimFlow } from "./claim-flow";
import { ClaimRestricted } from "./claim-restricted";
import { isRestricted } from "./lib/is-restricted";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Decimals } from "../../lib/web3-utils";

const Claim = () => {
  const params = useSearchParams();
  const { appState, appDispatch } = useAppState();
  const vesting = useVegaVesting();
  const [state, dispatch] = React.useReducer(claimReducer, initialClaimState);

  React.useEffect(() => {
    dispatch({
      type: "SET_DATA_FROM_URL",
      decimals: Decimals[appState.chainId!],
      data: {
        nonce: params.n,
        trancheId: params.t,
        expiry: params.ex,
        target: params.targ,
        denomination: params.d,
        code: params.r,
      },
    });
  }, [appState.chainId, dispatch, params]);

  // If the claim has been committed refetch the new VEGA balance
  React.useEffect(() => {
    if (state.claimStatus === ClaimStatus.Finished && appState.address) {
      vesting
        .getUserBalanceAllTranches(appState.address)
        .then((balance) => appDispatch({ type: "SET_BALANCE", balance }));
      vesting.getAllTranches().then((tranches) => {
        appDispatch({ type: "SET_TRANCHES", tranches });
      });
    }
  }, [vesting, state.claimStatus, appState.address, appDispatch]);

  if (isRestricted()) {
    return <ClaimRestricted />;
  }

  if (state.error) {
    return <ClaimError />;
  }

  if (state.code) {
    return <ClaimFlow state={state} dispatch={dispatch} />;
  }

  return null;
};

export default Claim;
