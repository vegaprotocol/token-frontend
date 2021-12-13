import React from "react";
import * as Sentry from "@sentry/react";
import { ADDRESSES } from "../../config";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useContracts } from "../../contexts/contracts/contracts-context";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { BigNumber } from "../../lib/bignumber";
import { useGetUserTrancheBalances } from "../../hooks/use-get-user-tranche-balances";
import { useGetAssociationBreakdown } from "../../hooks/use-get-association-breakdown";

export const BalanceManager = ({ children }: any) => {
  const contracts = useContracts();
  const { ethAddress } = useWeb3();
  const { appDispatch } = useAppState();

  const getUserTrancheBalances = useGetUserTrancheBalances(
    ethAddress,
    contracts?.vesting
  );
  const getAssociationBreakdown = useGetAssociationBreakdown(
    ethAddress,
    contracts?.staking,
    contracts?.vesting
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
  }, [appDispatch, contracts?.token, contracts?.vesting, ethAddress]);

  React.useEffect(() => {
    if (ethAddress) {
      getUserTrancheBalances();
    }
  }, [ethAddress, getUserTrancheBalances]);

  React.useEffect(() => {
    if (ethAddress) {
      getAssociationBreakdown();
    }
  }, [ethAddress, getAssociationBreakdown]);

  return children;
};
