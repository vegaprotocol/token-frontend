import React from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { TransactionConfirm } from "../transaction-confirm";
import { WrongChain } from "../wrong-chain";

export const Web3Container = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const connect = useConnect();

  if (appState.chainId !== appState.appChainId) {
    return (
      <WrongChain
        currentChainId={appState.chainId!}
        desiredChainId={appState.appChainId}
      />
    );
  }

  if (!appState.hasProvider) {
    return <p>{t("invalidWeb3Browser")}</p>;
  }

  if (appState.connecting) {
    <TransactionConfirm />;
  }

  if (!appState.address) {
    return (
      <>
        <p>
          {t(
            "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas."
          )}
        </p>
        <button onClick={connect}>{t("Connect to an Ethereum wallet")}</button>
      </>
    );
  }

  return <>{children}</>;
};
