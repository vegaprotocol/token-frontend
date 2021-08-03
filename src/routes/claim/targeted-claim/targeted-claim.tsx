import React from "react";
import { ClaimForm } from "../claim-form";
import BN from "bn.js";
import { useTransaction } from "../../../hooks/use-transaction";
import { TxState } from "../transaction-reducer";
import { LockedBanner } from "../locked-banner";
import { useVegaClaim } from "../../../hooks/use-vega-claim";
import { ClaimAction, ClaimState, ClaimStatus } from "../claim-reducer";

interface TargetedClaimProps {
  claimCode: string;
  denomination: BN;
  trancheId: number;
  expiry: number;
  nonce: string;
  targeted: boolean;
  account: string;
  state: ClaimState;
  dispatch: React.Dispatch<ClaimAction>;
  isValid: boolean;
  loading: boolean;
}

export const TargetedClaim = ({
  claimCode,
  denomination,
  trancheId,
  expiry,
  nonce,
  targeted,
  account,
  state,
  dispatch,
  loading,
  isValid,
}: TargetedClaimProps) => {
  const claim = useVegaClaim();
  const {
    state: txState,
    dispatch: txDispatch,
    perform: claimTargeted,
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
    if (txState.txState === TxState.Complete) {
      dispatch({ type: "SET_CLAIM_STATUS", status: ClaimStatus.Used });
    }
  }, [txState.txState, dispatch]);

  return txState.txState === TxState.Complete ? (
    <LockedBanner />
  ) : (
    <ClaimForm
      completed={false}
      txState={txState}
      onSubmit={claimTargeted}
      txDispatch={txDispatch}
      isValid={isValid}
      loading={loading}
    />
  );
};
