import React from "react";
import { ClaimStep1 } from "../claim-step-1";
import { ClaimStep2 } from "../claim-step-2";
import BN from "bn.js";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TxState } from "../../../hooks/transaction-reducer";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaClaim } from "../../../hooks/use-vega-claim";
import { ClaimAction, ClaimState, ClaimStatus } from "../claim-reducer";

interface UntargetedClaimProps {
  claimCode: string;
  denomination: BN;
  trancheId: number;
  expiry: number;
  nonce: string;
  targeted: boolean;
  account: string;
  committed: boolean;
  state: ClaimState;
  dispatch: React.Dispatch<ClaimAction>;
  loading: boolean;
  isValid: boolean;
}

export const UntargetedClaim = ({
  claimCode,
  denomination,
  trancheId,
  expiry,
  nonce,
  targeted,
  account,
  committed,
  state,
  dispatch,
  loading,
  isValid,
}: UntargetedClaimProps) => {
  const { appState } = useAppState();
  const claim = useVegaClaim();

  const {
    state: commitState,
    dispatch: commitDispatch,
    perform: commitClaim,
  } = useTransaction(() => claim.commit(claimCode, appState.address!));
  const {
    state: revealState,
    dispatch: revealDispatch,
    perform: commitReveal,
  } = useTransaction(() =>
    claim.claim({
      claimCode,
      denomination,
      trancheId,
      expiry,
      nonce,
      country: state.countryCode!,
      targeted,
      account,
    })
  );

  React.useEffect(() => {
    if (revealState.txState === TxState.Complete) {
      dispatch({ type: "SET_CLAIM_STATUS", status: ClaimStatus.Finished });
    }
  }, [revealState.txState, dispatch]);

  return (
    <>
      <ClaimStep1
        loading={loading}
        isValid={isValid}
        txState={commitState}
        txDispatch={commitDispatch}
        completed={committed}
        onSubmit={commitClaim}
      />
      <ClaimStep2
        loading={loading}
        isValid={isValid}
        txState={revealState}
        txDispatch={revealDispatch}
        amount={denomination}
        onSubmit={commitReveal}
        step1Completed={committed || commitState.txState === TxState.Complete}
      />
    </>
  );
};
