import detectEthereumProvider from "@metamask/detect-provider";
import React from "react";
import Web3 from "web3";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import VegaClaim from "../../../lib/vega-claim";
import { ClaimForm } from "../claim-form";
import { ClaimAction, ClaimState } from "../claim-form/claim-reducer";

interface TargetedClaimProps {
  state: ClaimState;
  dispatch: (action: ClaimAction) => void;
}

export const TargetedClaim = ({ state, dispatch }: TargetedClaimProps) => {
  const { appState } = useAppState();
  const claim = React.useCallback(async () => {
    dispatch({ type: "CLAIM_TX_REQUESTED" });
    const provider = (await detectEthereumProvider()) as any;
    const web3 = new Web3(provider);
    const claim = new VegaClaim(
      web3,
      "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21"
    );
    claim
      .claim({
        claimCode: state.code!,
        denomination: state.denomination!,
        trancheId: state.trancheId!,
        expiry: state.expiry!,
        nonce: state.nonce!,
        country: "GB",
        targeted: !!state.target,
        account: appState.address!,
      })
      .once("transactionHash", (hash: string) => {
        dispatch({ type: "CLAIM_TX_SUBMITTED", txHash: hash });
      })
      .once("receipt", (receipt: any) => {
        dispatch({ type: "CLAIM_TX_COMPLETE", receipt });
      })
      .once("error", (err: Error) => {
        console.log(err);
        dispatch({ type: "CLAIM_TX_ERROR", error: err });
      });
  }, [
    appState.address,
    dispatch,
    state.code,
    state.denomination,
    state.expiry,
    state.nonce,
    state.target,
    state.trancheId,
  ]);
  return (
    <ClaimForm
      completed={false}
      state={state}
      onSubmit={() => claim()}
      dispatch={dispatch}
    />
  );
};
