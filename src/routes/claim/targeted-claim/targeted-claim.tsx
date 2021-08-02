import { ClaimForm } from "../claim-form";
import BN from "bn.js";
import { useTransaction } from "../../../hooks/use-transaction";
import { TxState } from "../transaction-reducer";
import { LockedBanner } from "../locked-banner";
import { useVegaClaim } from "../../../hooks/use-vega-claim";

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
}: TargetedClaimProps) => {
  const claim = useVegaClaim();
  const {
    state,
    dispatch,
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

  return state.txState === TxState.Complete ? (
    <LockedBanner />
  ) : (
    <ClaimForm
      isValid={isValid}
      loading={loading}
      completed={false}
      state={state}
      onSubmit={claimTargeted}
      dispatch={dispatch}
    />
  );
};
