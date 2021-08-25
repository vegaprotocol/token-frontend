import React from "react";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { useVegaToken } from "../../hooks/use-vega-token";
import { EthereumChainNames } from "../../lib/web3-utils";
import { Callout } from "../callout";
import { Error } from "../icons";

export const Web3Container = ({
  children,
}: {
  /* if children is a function we can ensure you have address before rendering */
  children: React.ReactNode | ((address: string) => JSX.Element);
}) => {
  const { t } = useTranslation();
  const { appState, appDispatch } = useAppState();
  const connect = useConnect();
  const vegaToken = useVegaToken();

  React.useEffect(() => {
    const run = async () => {
      const supply = await vegaToken.getTotalSupply();
      const decimals = await vegaToken.getDecimals();
      appDispatch({
        type: AppStateActionType.SET_TOKEN,
        decimals,
        totalSupply: supply,
      });
    };

    if (appState.providerStatus !== ProviderStatus.None) {
      run();
    }
  }, [vegaToken, appState.providerStatus, appDispatch]);

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

  if (typeof children !== "function") {
    return children;
  }

  if (appState.connecting) {
    return (
      <Callout>
        {t("Awaiting action in Ethereum wallet (e.g. metamask)")}
      </Callout>
    );
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

  return children(appState.address);
};
