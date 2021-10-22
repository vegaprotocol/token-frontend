import React from "react";
import { useWeb3 } from "../web3-context/web3-context";
import { ContractsContext } from "./contracts-context";
import { ADDRESSES } from "../../config";
import {
  AppStateActionType,
  useAppState,
} from "../app-state/app-state-context";
import * as Sentry from "@sentry/react";
import { BigNumber } from "../../lib/bignumber";
import { useGetUserTrancheBalances } from "../../hooks/use-get-user-tranche-balances";
import { useGetAssociationBreakdown } from "../../hooks/use-get-association-breakdown";

// Note: Each contract class imported below gets swapped out for a mocked version
// at ../../lib/vega-web3/__mocks__ at build time using webpack.NormalModuleReplacementPlugin
// when you run the app with REACT_APP_MOCKED=1

// @ts-ignore
import VegaToken from "../../lib/VEGA_WEB3/vega-token";
// @ts-ignore
import StakingAbi from "../../lib/VEGA_WEB3/vega-staking";
// @ts-ignore
import VegaVesting from "../../lib/VEGA_WEB3/vega-vesting";
// @ts-ignore
import VegaClaim from "../../lib/VEGA_WEB3/vega-claim";

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const ContractsProvider = ({ children }: { children: JSX.Element }) => {
  const { provider, signer, ethAddress } = useWeb3();
  const {
    appState: { decimals },
    appDispatch,
  } = useAppState();

  const contracts = React.useMemo(() => {
    return {
      token: new VegaToken(provider, signer, ADDRESSES.vegaTokenAddress),
      staking: new StakingAbi(
        provider,
        signer,
        ADDRESSES.stakingBridge,
        decimals
      ),
      vesting: new VegaVesting(
        provider,
        signer,
        ADDRESSES.vestingAddress,
        decimals
      ),
      claim: new VegaClaim(provider, signer, ADDRESSES.claimAddress, decimals),
    };
  }, [provider, signer, decimals]);

  const getUserTrancheBalances = useGetUserTrancheBalances(
    ethAddress,
    contracts.vesting
  );
  const getAssociationBreakdown = useGetAssociationBreakdown(
    ethAddress,
    contracts.staking,
    contracts.vesting
  );

  // update balances on connect to Ethereum
  React.useEffect(() => {
    const updateBalances = async () => {
      try {
        const [balance, walletBalance, lien, allowance] = await Promise.all([
          contracts.vesting.getUserBalanceAllTranches(ethAddress),
          contracts.token.balanceOf(ethAddress),
          contracts.vesting.getLien(ethAddress),
          contracts.token.allowance(ethAddress, ADDRESSES.stakingBridge),
        ]);
        appDispatch({
          type: AppStateActionType.UPDATE_ACCOUNT_BALANCES,
          balance: new BigNumber(balance),
          walletBalance,
          lien,
          allowance,
        });
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    if (ethAddress) {
      updateBalances();
    }
  }, [appDispatch, contracts.token, contracts.vesting, ethAddress]);

  React.useEffect(() => {
    if (ethAddress) {
      getUserTrancheBalances();
    }
  }, [ethAddress, getUserTrancheBalances]);

  React.useEffect(() => {
    getAssociationBreakdown();
  }, [getAssociationBreakdown]);

  return (
    <ContractsContext.Provider value={contracts}>
      {children}
    </ContractsContext.Provider>
  );
};
