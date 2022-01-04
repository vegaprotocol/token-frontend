import * as Sentry from "@sentry/react";
import React from "react";

import { ADDRESSES } from "../../config";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useContracts } from "../../contexts/contracts/contracts-context";
import { useGetAssociationBreakdown } from "../../hooks/use-get-association-breakdown";
import { useGetUserTrancheBalances } from "../../hooks/use-get-user-tranche-balances";
import { useWeb3 } from "../../hooks/use-web3";
import { BigNumber } from "../../lib/bignumber";

export const BalanceManager = ({ children }: any) => {
  const contracts = useContracts();
  const { account } = useWeb3();
  const { appDispatch } = useAppState();

  const getUserTrancheBalances = useGetUserTrancheBalances(
    account || "",
    contracts?.vesting
  );
  const getAssociationBreakdown = useGetAssociationBreakdown(
    account || "",
    contracts?.staking,
    contracts?.vesting
  );

  // update balances on connect to Ethereum
  React.useEffect(() => {
    const updateBalances = async () => {
      if (!account) return;
      try {
        const [balance, walletBalance, lien, allowance] = await Promise.all([
          contracts.vesting.getUserBalanceAllTranches(account),
          contracts.token.balanceOf(account),
          contracts.vesting.getLien(account),
          contracts.token.allowance(account, ADDRESSES.stakingBridge),
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

    updateBalances();
  }, [appDispatch, contracts?.token, contracts?.vesting, account]);

  React.useEffect(() => {
    if (account) {
      getUserTrancheBalances();
    }
  }, [account, getUserTrancheBalances]);

  React.useEffect(() => {
    if (account) {
      getAssociationBreakdown();
    }
  }, [account, getAssociationBreakdown]);

  return children;
};
