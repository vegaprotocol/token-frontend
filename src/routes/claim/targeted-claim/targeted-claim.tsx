import { ClaimForm } from "../claim-form";
import BN from "bn.js";
import { useTransaction } from "../../../hooks/use-transaction";
import { TxState } from "../transaction-reducer";
import { LockedBanner } from "../locked-banner";
import { useValidateCountry } from "../hooks";
import { useVegaClaim } from "../../../hooks/use-vega-claim";

interface TargetedClaimProps {
  claimCode: string;
  denomination: BN;
  trancheId: number;
  expiry: number;
  nonce: string;
  targeted: boolean;
  account: string;
}

export const TargetedClaim = ({
  claimCode,
  denomination,
  trancheId,
  expiry,
  nonce,
  targeted,
  account,
}: TargetedClaimProps) => {
  const params = useValidateCountry();
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
      country: params.country!.code,
      targeted,
      account,
    })
  );

  return state.txState === TxState.Complete ? (
    <LockedBanner />
  ) : (
    <ClaimForm
      {...params}
      completed={false}
      state={state}
      onSubmit={claimTargeted}
      dispatch={dispatch}
    />
  );
};
