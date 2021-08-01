import { ClaimStep1 } from "../claim-step-1";
import { ClaimStep2 } from "../claim-step-2";
import BN from "bn.js";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import React from "react";
import Web3 from "web3";
import VegaClaim from "../../../lib/vega-claim";
import { TxState } from "../transaction-reducer";
import { useTransaction } from "../../../hooks/use-transaction";
import { LockedBanner } from "../locked-banner";
import { useValidateCountry } from "../hooks";

interface UntargetedClaimProps {
  claimCode: string;
  denomination: BN;
  trancheId: number;
  expiry: number;
  nonce: string;
  targeted: boolean;
  account: string;
  committed: boolean;
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
}: UntargetedClaimProps) => {
  const params = useValidateCountry();
  const { appState, provider } = useAppState();
  const claim = React.useMemo(() => {
    const web3 = new Web3(provider);
    return new VegaClaim(web3, "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21");
  }, [provider]);
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
      country: params.country!.code,
      targeted,
      account,
    })
  );
  return revealState.txState === TxState.Complete &&
    (commitState.txState === TxState.Complete || committed) ? (
    <LockedBanner />
  ) : (
    <>
      <ClaimStep1
        {...params}
        state={commitState}
        dispatch={commitDispatch}
        completed={committed}
        onSubmit={commitClaim}
      />
      <ClaimStep2
        dispatch={revealDispatch}
        amount={denomination}
        onSubmit={commitReveal}
        state={revealState}
        step1Completed={committed || commitState.txState === TxState.Complete}
      />
    </>
  );
};
