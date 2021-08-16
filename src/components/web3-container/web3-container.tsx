import React from "react";
import { useTranslation } from "react-i18next";
import {
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { EthereumChainNames } from "../../lib/web3-utils";
import { Callout } from "../callout";
import { Error } from "../icons";

export const Web3Container = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation();

  const { appState } = useAppState();

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

  return <>{children}</>;
};
