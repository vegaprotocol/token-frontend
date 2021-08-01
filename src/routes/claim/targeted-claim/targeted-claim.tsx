import React from "react";
import Web3 from "web3";
import VegaClaim from "../../../lib/vega-claim";
import { ClaimForm } from "../claim-form";
import BN from "bn.js";
import { useTransaction } from "../../../hooks/use-transaction";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TxState } from "../transaction-reducer";
import { LockedBanner } from "../locked-banner";

interface TargetedClaimProps {
  claimCode: string;
  denomination: BN;
  trancheId: number;
  expiry: number;
  nonce: string;
  country: string;
  targeted: boolean;
  account: string;
}

export const TargetedClaim = ({
  claimCode,
  denomination,
  trancheId,
  expiry,
  nonce,
  country,
  targeted,
  account,
}: TargetedClaimProps) => {
  const { provider } = useAppState();
  const claim = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaClaim(web3, "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21");
  }, [provider]);
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
      country,
      targeted,
      account,
    })
  );

  return state.txState === TxState.Complete ? (
    <LockedBanner />
  ) : (
    <ClaimForm
      completed={false}
      state={state}
      onSubmit={claimTargeted}
      dispatch={dispatch}
    />
  );
};
