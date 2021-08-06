import React from "react";
import { ClaimForm } from "../claim-form";
import { useTransaction } from "../../../hooks/use-transaction";
import { TxState } from "../../../hooks/transaction-reducer";
import { useVegaClaim } from "../../../hooks/use-vega-claim";
import { ClaimAction, ClaimState, ClaimStatus } from "../claim-reducer";
import { BigNumber } from "../../../lib/bignumber";

interface TargetedClaimProps {
  claimCode: string;
  denomination: BigNumber;
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
  const claimArgs = {
    claimCode,
    denomination,
    trancheId,
    expiry,
    nonce,
    country: state.countryCode!,
    targeted,
    account,
  };
  const claim = useVegaClaim();
  const {
    state: txState,
    dispatch: txDispatch,
    perform: claimTargeted,
  } = useTransaction(
    () => claim.claim(claimArgs),
    () => claim.checkClaim(claimArgs)
  );

  React.useEffect(() => {
    if (txState.txState === TxState.Complete) {
      dispatch({ type: "SET_CLAIM_STATUS", status: ClaimStatus.Finished });
    }
  }, [txState.txState, dispatch]);

  return (
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
