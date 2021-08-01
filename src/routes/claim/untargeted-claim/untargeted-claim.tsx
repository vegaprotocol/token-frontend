import { ClaimStep1 } from "../claim-step-1";
import { ClaimStep2 } from "../claim-step-2";
import BN from "bn.js";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import React from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import VegaClaim from "../../../lib/vega-claim";
import {
  initialState,
  transactionReducer,
  TxState,
} from "../transaction-reducer";

interface UntargetedClaimProps {
  claimCode: string;
  denomination: BN;
  trancheId: number;
  expiry: number;
  nonce: string;
  country: string;
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
  country,
  targeted,
  account,
  committed,
}: UntargetedClaimProps) => {
  const [revealState, revealDispatch] = React.useReducer(
    transactionReducer,
    initialState
  );
  const [commitState, commitDispatch] = React.useReducer(
    transactionReducer,
    initialState
  );
  const { appState } = useAppState();
  const { address } = appState;
  const commitClaim = React.useCallback(async () => {
    commitDispatch({ type: "TX_REQUESTED" });
    const provider = (await detectEthereumProvider()) as any;
    const web3 = new Web3(provider);
    const claim = new VegaClaim(
      web3,
      "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21"
    );
    claim
      .commit(claimCode, appState.address!)
      .once("transactionHash", (hash: string) => {
        commitDispatch({ type: "TX_SUBMITTED", txHash: hash });
      })
      .once("receipt", (receipt: any) => {
        commitDispatch({ type: "TX_COMPLETE", receipt });
      })
      .once("error", (err: Error) => {
        console.log(err);
        commitDispatch({ type: "TX_ERROR", error: err });
      });
  }, [claimCode, appState.address]);
  const commitReveal = React.useCallback(async () => {
    revealDispatch({ type: "TX_REQUESTED" });
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
        account: address!,
      })
      .on("transactionHash", (hash: string) => {
        revealDispatch({ type: "TX_SUBMITTED", txHash: hash });
      })
      .on("receipt", (receipt: any) => {
        revealDispatch({ type: "TX_COMPLETE", receipt });
      })
      .on("error", (err: Error) => {
        revealDispatch({ type: "TX_ERROR", error: err });
      });
  }, [
    address,
    claimCode,
    country,
    denomination,
    expiry,
    nonce,
    targeted,
    trancheId,
  ]);
  return (
    <>
      <ClaimStep1
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
