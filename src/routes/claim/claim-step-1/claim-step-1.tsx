import detectEthereumProvider from "@metamask/detect-provider";
import React from "react";
import { useTranslation } from "react-i18next";
import Web3 from "web3";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import VegaClaim from "../../../lib/vega-claim";
import { ClaimForm } from "../claim-form";
import { ClaimAction, ClaimState } from "../claim-form/claim-reducer";

interface ClaimStep2 {
  state: ClaimState;
  dispatch: (action: ClaimAction) => void;
  completed: boolean;
}

export const ClaimStep1 = ({ state, dispatch, completed }: ClaimStep2) => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const commitClaim = React.useCallback(async () => {
    dispatch({ type: "CLAIM_TX_REQUESTED" });
    const provider = (await detectEthereumProvider()) as any;
    const web3 = new Web3(provider);
    const claim = new VegaClaim(
      web3,
      "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21"
    );
    claim
      .commit(state.code!, appState.address!)
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
  }, [appState.address, dispatch, state.code]);
  return (
    <div
      data-testid="claim-step-1"
      style={{
        padding: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between ",
      }}
    >
      <h1>{t("step1Title")}</h1>
      <p>{t("step1Body")}</p>
      <ClaimForm
        completed={completed}
        state={state}
        onSubmit={() => commitClaim()}
        dispatch={dispatch}
      />
    </div>
  );
};
