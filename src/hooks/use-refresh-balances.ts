import React from "react";
import * as Sentry from "@sentry/react";
import { ADDRESSES } from "../config";
import {
  AppStateActionType,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { Flags } from "../config";
import { BigNumber } from "../lib/bignumber";
import { useContracts } from "../contexts/contracts/contracts-context";
import { useVegaVesting } from "./use-vega-vesting";

export const useRefreshBalances = (address: string) => {
  const { appState, appDispatch } = useAppState();
  const vesting = useVegaVesting();
  const { token, staking } = useContracts();

  return React.useCallback(async () => {
    try {
      const [
        balance,
        walletBalance,
        lien,
        allowance,
        walletAssociatedBalance,
        vestingAssociatedBalance,
      ] = await Promise.all([
        vesting.getUserBalanceAllTranches(address),
        token.balanceOf(address),
        vesting.getLien(address),
        Flags.STAKING_DISABLED
          ? new BigNumber(0)
          : token.allowance(address, ADDRESSES.stakingBridge),
        // Refresh connected vega key balances as well if we are connected to a vega key
        appState.currVegaKey?.pub
          ? staking.stakeBalance(address, appState.currVegaKey.pub)
          : null,
        appState.currVegaKey?.pub
          ? vesting.stakeBalance(address, appState.currVegaKey.pub)
          : null,
      ]);
      appDispatch({
        type: AppStateActionType.REFRESH_BALANCES,
        balance,
        walletBalance,
        allowance,
        lien,
        walletAssociatedBalance,
        vestingAssociatedBalance,
      });
    } catch (err) {
      Sentry.captureException(err);
    }
  }, [
    address,
    appDispatch,
    appState.currVegaKey?.pub,
    staking,
    token,
    vesting,
  ]);
};
