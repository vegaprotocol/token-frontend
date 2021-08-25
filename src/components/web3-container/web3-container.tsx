import React from "react";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { useVegaToken } from "../../hooks/use-vega-token";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { BigNumber } from "../../lib/bignumber";
import { EthereumChainId, EthereumChainNames } from "../../lib/web3-utils";
import { Callout } from "../callout";
import { Error } from "../icons";

export const Web3Container = ({
  children,
}: {
  /* if children is a function we can ensure you have address before rendering */
  children: React.ReactNode | ((address: string) => JSX.Element);
}) => {
  const { t } = useTranslation();
  const { appState, appDispatch, provider } = useAppState();
  const connect = useConnect();
  const vegaToken = useVegaToken();
  const vega = useVegaVesting();

  // Bind listeners for account change
  React.useEffect(() => {
    if (appState.providerStatus === ProviderStatus.Ready) {
      provider.on("accountsChanged", async (accounts: string[]) => {
        if (accounts.length) {
          const [balance, walletBalance, lien] = await Promise.all([
            vega.getUserBalanceAllTranches(accounts[0]),
            vegaToken.balanceOf(accounts[0]),
            vega.getLien(accounts[0]),
          ]);
          appDispatch({
            type: AppStateActionType.ACCOUNTS_CHANGED,
            address: accounts[0],
            balance: new BigNumber(balance),
            walletBalance,
            lien,
          });
        } else {
          appDispatch({ type: AppStateActionType.DISCONNECT });
        }
      });
      provider.on("chainChanged", (chainId: EthereumChainId) => {
        appDispatch({ type: AppStateActionType.CHAIN_CHANGED, chainId });
      });
    }
  }, [appDispatch, appState.providerStatus, provider, vega, vegaToken]);

  React.useEffect(() => {
    const run = async () => {
      const [supply, totalStaked, decimals] = await Promise.all([
        vegaToken.totalSupply(),
        vega.totalStaked(),
        vegaToken.decimals(),
      ]);
      appDispatch({
        type: AppStateActionType.SET_TOKEN,
        decimals,
        totalSupply: supply.toString(),
        totalStaked,
      });
    };

    if (appState.providerStatus !== ProviderStatus.None) {
      run();
    }
  }, [vegaToken, appState.providerStatus, appDispatch, vega]);

  if (appState.providerStatus === ProviderStatus.None) {
    let error: string
    // @ts-ignore
    if (window?.web3?.currentProvider && !window.web3.currentProvider.request) {
      error = t("invalidWeb3Provider")
    } else {
      error = t("invalidWeb3Browser")
    }
    return (
      <Callout title={t("Cannot connect")} intent="error" icon={<Error />}>
        <p>{error}</p>
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
