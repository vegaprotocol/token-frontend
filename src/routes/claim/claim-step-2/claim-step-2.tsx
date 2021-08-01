import React from "react";
import { useTranslation } from "react-i18next";
import { TransactionComplete } from "../../../components/transaction-complete";
import { TransactionConfirm } from "../../../components/transaction-confirm";
import { TransactionError } from "../../../components/transaction-error";
import { TransactionsInProgress } from "../../../components/transaction-in-progress";
import BN from "bn.js";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import VegaClaim from "../../../lib/vega-claim";
import { ClaimState } from "../claim-reducer";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import {
  initialState,
  transactionReducer,
  TxState,
} from "../transaction-reducer";

export const ClaimStep2 = ({
  step1Completed,
  amount,
  claimState,
}: {
  step1Completed: boolean;
  amount: BN | null;
  claimState: ClaimState;
}) => {
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer(transactionReducer, initialState);
  const { appState } = useAppState();
  const { chainId, address } = appState;
  const commitReveal = React.useCallback(async () => {
    dispatch({ type: "TX_REQUESTED" });
    const provider = (await detectEthereumProvider()) as any;
    const web3 = new Web3(provider);
    const claim = new VegaClaim(
      web3,
      "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21"
    );
    claim
      .claim({
        claimCode: claimState.code!,
        denomination: claimState.denomination!,
        trancheId: claimState.trancheId!,
        expiry: claimState.expiry!,
        nonce: claimState.nonce!,
        country: "GB",
        targeted: !!claimState.target,
        account: address!,
      })
      .on("transactionHash", (hash: string) => {
        dispatch({ type: "TX_SUBMITTED", txHash: hash });
      })
      .on("receipt", (receipt: any) => {
        dispatch({ type: "TX_COMPLETE", receipt });
      })
      .on("error", (err: Error) => {
        dispatch({ type: "TX_ERROR", error: err });
      });
  }, [
    address,
    claimState.code,
    claimState.denomination,
    claimState.expiry,
    claimState.nonce,
    claimState.target,
    claimState.trancheId,
  ]);
  let content = null;
  if (state.txState === TxState.Error) {
    content = (
      <TransactionError
        onActionClick={() => dispatch({ type: "TX_RESET" })}
        error={state.txData.error}
        hash={state.txData.hash}
        chainId={chainId!}
      />
    );
  } else if (state.txState === TxState.Pending) {
    content = (
      <TransactionsInProgress hash={state.txData.hash!} chainId={chainId!} />
    );
  } else if (state.txState === TxState.Requested) {
    content = <TransactionConfirm />;
  } else if (state.txState === TxState.Complete) {
    content = (
      <TransactionComplete hash={state.txData.hash!} chainId={chainId!} />
    );
  } else {
    content = (
      <button disabled={!step1Completed} onClick={() => commitReveal()}>
        {t("Claim {amount} Vega", { amount })}
      </button>
    );
  }
  return (
    <div
      data-testid="claim-step-2"
      style={{
        padding: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between ",
      }}
    >
      <h1>{t("step2Title")}</h1>
      <p>{t("step2Body")}</p>
      {step1Completed ? (
        content
      ) : (
        <p style={{ color: "#767676" }}>{t("step2Note")}</p>
      )}
    </div>
  );
};
