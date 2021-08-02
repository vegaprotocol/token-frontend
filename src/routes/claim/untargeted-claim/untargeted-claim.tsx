import React from "react";
import { ClaimStep1 } from "../claim-step-1";
import { ClaimStep2 } from "../claim-step-2";
import BN from "bn.js";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TxState } from "../transaction-reducer";
import { useTransaction } from "../../../hooks/use-transaction";
import { LockedBanner } from "../locked-banner";
import { useVegaClaim } from "../../../hooks/use-vega-claim";
import { ClaimAction, ClaimStatus } from "../claim-reducer";

interface UntargetedClaimProps {
  claimCode: string;
  denomination: BN;
  trancheId: number;
  expiry: number;
  nonce: string;
  targeted: boolean;
  account: string;
  committed: boolean;
  country: string | null | undefined;
  isValid: boolean;
  loading: boolean;
  dispatch: React.Dispatch<ClaimAction>;
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
  country,
  loading,
  isValid,
  dispatch,
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
      country: country!,
      targeted,
      account,
    })
  );

  React.useEffect(() => {
    if (revealState.txState === TxState.Complete) {
      dispatch({ type: "SET_CLAIM_STATUS", status: ClaimStatus.Committed });
    }
  }, [revealState.txState, dispatch]);

  if (
    revealState.txState === TxState.Complete &&
    (commitState.txState === TxState.Complete || committed)
  ) {
    return <LockedBanner />;
  }

  return (
    <>
      <ClaimStep1
        isValid={isValid}
        loading={loading}
        state={commitState}
        dispatch={commitDispatch}
        completed={committed}
        onSubmit={commitClaim}
      />
      <ClaimStep2
        isValid={isValid}
        loading={loading}
        dispatch={revealDispatch}
        amount={denomination}
        onSubmit={commitReveal}
        state={revealState}
        step1Completed={committed || commitState.txState === TxState.Complete}
      />
    </>
  );
};
