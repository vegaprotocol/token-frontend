import React from "react";
import { ClaimForm } from "../claim-form";
import BN from "bn.js";
import { useTransaction } from "../../../hooks/use-transaction";
import { TxState } from "../transaction-reducer";
import { LockedBanner } from "../locked-banner";
import { useVegaClaim } from "../../../hooks/use-vega-claim";
import { ClaimAction, ClaimStatus } from "../claim-reducer";

interface TargetedClaimProps {
  claimCode: string;
  denomination: BN;
  trancheId: number;
  expiry: number;
  nonce: string;
  targeted: boolean;
  account: string;
  country: string | null | undefined;
  isValid: boolean;
  loading: boolean;
  dispatch: React.Dispatch<ClaimAction>;
}

export const TargetedClaim = ({
  claimCode,
  denomination,
  trancheId,
  expiry,
  nonce,
  targeted,
  account,
  isValid,
  loading,
  country,
  dispatch,
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
      country: country!,
      targeted,
      account,
    })
  );

  React.useEffect(() => {
    if (txState.txState === TxState.Complete) {
      dispatch({ type: "SET_CLAIM_STATUS", status: ClaimStatus.Committed });
    }
  }, [txState.txState, dispatch]);

  return txState.txState === TxState.Complete ? (
    <LockedBanner />
  ) : (
    <ClaimForm
      isValid={isValid}
      loading={loading}
      completed={false}
      state={txState}
      onSubmit={claimTargeted}
      dispatch={txDispatch}
    />
  );
};
