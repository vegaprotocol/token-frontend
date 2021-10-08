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
import { useVegaWallet } from "../contexts/vega-wallet/vega-wallet-context";

export const useRefreshBalances = (address: string) => {
  const { appDispatch } = useAppState();
  const { vegaWalletState } = useVegaWallet();
  const { token, staking, vesting } = useContracts();

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
        vegaWalletState.currKey?.pub
          ? staking.stakeBalance(address, vegaWalletState.currKey.pub)
          : null,
        vegaWalletState.currKey?.pub
          ? vesting.stakeBalance(address, vegaWalletState.currKey.pub)
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
    vegaWalletState.currKey?.pub,
    staking,
    token,
    vesting,
  ]);
};
