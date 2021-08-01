import detectEthereumProvider from "@metamask/detect-provider";
import React from "react";
import Web3 from "web3";
import VegaClaim from "../../../lib/vega-claim";
import { ClaimForm } from "../claim-form";
import { initialState, transactionReducer } from "../transaction-reducer";
import BN from "bn.js";

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
  const [state, dispatch] = React.useReducer(transactionReducer, initialState);

  const claim = React.useCallback(async () => {
    dispatch({ type: "TX_REQUESTED" });
    const provider = (await detectEthereumProvider()) as any;
    const web3 = new Web3(provider);
    const claim = new VegaClaim(
      web3,
      "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21"
    );
    claim
      .claim({
        claimCode,
        denomination,
        trancheId,
        expiry,
        nonce,
        country,
        targeted,
        account,
      })
      .once("transactionHash", (hash: string) => {
        dispatch({ type: "TX_SUBMITTED", txHash: hash });
      })
      .once("receipt", (receipt: any) => {
        dispatch({ type: "TX_COMPLETE", receipt });
      })
      .once("error", (err: Error) => {
        console.log(err);
        dispatch({ type: "TX_ERROR", error: err });
      });
  }, [
    account,
    claimCode,
    country,
    denomination,
    expiry,
    nonce,
    targeted,
    trancheId,
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
