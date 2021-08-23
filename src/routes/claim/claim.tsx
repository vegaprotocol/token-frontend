import React from "react";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useSearchParams } from "../../hooks/use-search-params";
import { ClaimError } from "./claim-error";
import {
  ClaimActionType,
  claimReducer,
  ClaimStatus,
  initialClaimState,
} from "./claim-reducer";
import { ClaimFlow } from "./claim-flow";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";

const Claim = ({
  address,
  tranches,
}: {
  address: string;
  tranches: Tranche[];
}) => {
  const params = useSearchParams();
  const { appState, appDispatch } = useAppState();
  const vesting = useVegaVesting();
  const [state, dispatch] = React.useReducer(claimReducer, initialClaimState);

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
      vesting
        .getUserBalanceAllTranches(address)
        .then((balance) =>
          appDispatch({ type: AppStateActionType.SET_BALANCE, balance })
        );
      vesting.getAllTranches().then((tranches) => {
        appDispatch({ type: AppStateActionType.SET_TRANCHES, tranches });
      });
    }
  }, [vesting, state.claimStatus, address, appDispatch]);

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
