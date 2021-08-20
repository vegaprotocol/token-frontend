import React from "react";
import { useTranslation } from "react-i18next";
import {
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { EthereumChainNames } from "../../lib/web3-utils";
import { Callout } from "../callout";
import { Error } from "../icons";

export const Web3Container = ({
  children,
  addressRequired = false,
}: {
  children: React.ReactNode;
  /* require connecting to metamask and having address to render children */
  addressRequired?: boolean;
}) => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const connect = useConnect();

  if (appState.providerStatus === ProviderStatus.None) {
    return (
      <Callout title={t("Cannot connect")} intent="error" icon={<Error />}>
        <p>{t("invalidWeb3Browser")}</p>
      </Callout>
    );
  }

  if (appState.appChainId !== appState.chainId) {
    return (
      <Callout
        intent="error"
        icon={<Error />}
        title={t("Wrong network", {
          chain: EthereumChainNames[appState.chainId!],
        })}
      >
        <p>
          {t("Desired network", {
            chain: EthereumChainNames[appState.appChainId],
          })}
        </p>
      </Callout>
    );
  }

  if (addressRequired && appState.connecting) {
    return (
      <Callout>
        {t("Awaiting action in Ethereum wallet (e.g. metamask)")}
      </Callout>
    );
  }

  if (addressRequired && !appState.address) {
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
