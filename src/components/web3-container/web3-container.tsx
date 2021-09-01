import React from "react";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { Flags } from "../../flags";
import { useConnect } from "../../hooks/use-connect";
import { useVegaStaking } from "../../hooks/use-vega-staking";
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
  const token = useVegaToken();
  const staking = useVegaStaking();
  const vesting = useVegaVesting();
  const [triedToConnect, setTriedToConnect] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Auto connect if possible
    if (
      !triedToConnect &&
      // If we haven't loaded the contract information don't connect yet
      appState.tokenDataLoaded &&
      // We don't have an address we are not connected
      !appState.address &&
      // If we have an error we don't want to try reconnecting
      !appState.error &&
      // If we are connecting we don't want to try to connect
      !appState.connecting &&
      // @ts-ignore
      (window.ethereum || (window.web3 && window.web3.currentProvider))
    ) {
      try {
        setTriedToConnect(true);
        connect();
      } catch (e) {
        console.log(e);
      }
    }
  }, [
    appState.address,
    appState.connecting,
    appState.error,
    appState.tokenDataLoaded,
    connect,
    triedToConnect,
  ]);

  // Bind listeners for account change
  React.useEffect(() => {
    if (
      appState.tokenDataLoaded &&
      appState.providerStatus === ProviderStatus.Ready
    ) {
      provider.on("accountsChanged", async (accounts: string[]) => {
        if (accounts.length) {
          const [balance, walletBalance, lien, allowance] = await Promise.all([
            vesting.getUserBalanceAllTranches(accounts[0]),
            token.balanceOf(accounts[0]),
            vesting.getLien(accounts[0]),
            Flags.MAINNET_DISABLED
              ? new BigNumber(0)
              : token.allowance(
                  accounts[0],
                  appState.contractAddresses.stakingBridge
                ),
          ]);
          appDispatch({
            type: AppStateActionType.ACCOUNTS_CHANGED,
            address: accounts[0],
            balance: new BigNumber(balance),
            walletBalance,
            lien,
            allowance,
          });
        } else {
          appDispatch({ type: AppStateActionType.DISCONNECT });
        }
      });
      provider.on("chainChanged", (chainId: EthereumChainId) => {
        appDispatch({ type: AppStateActionType.CHAIN_CHANGED, chainId });
      });
    }
  }, [
    appDispatch,
    appState.contractAddresses.stakingBridge,
    appState.providerStatus,
    appState.tokenDataLoaded,
    provider,
    staking,
    token,
    vesting,
  ]);

  React.useEffect(() => {
    const run = async () => {
      const [supply, totalAssociatedWallet, totalAssociatedVesting, decimals] =
        await Promise.all([
          token.totalSupply(),
          staking.totalStaked(),
          vesting.totalStaked(),
          token.decimals(),
        ]);
      appDispatch({
        type: AppStateActionType.SET_TOKEN,
        decimals,
        totalSupply: supply.toString(),
        totalAssociated: totalAssociatedWallet.plus(totalAssociatedVesting),
      });
    };

    if (appState.providerStatus !== ProviderStatus.None) {
      run();
    }
  }, [token, appState.providerStatus, appDispatch, staking, vesting]);

  if (appState.providerStatus === ProviderStatus.None) {
    let error: string;
    // @ts-ignore
    if (window?.web3?.currentProvider && !window.web3.currentProvider.request) {
      error = t("invalidWeb3Provider");
    } else {
      error = t("invalidWeb3Browser");
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
        <button
          onClick={() =>
            appDispatch({
              type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
              isOpen: true,
            })
          }
        >
          {t("Connect to an Ethereum wallet")}
        </button>
      </>
    );
  }

  return children(appState.address);
};
