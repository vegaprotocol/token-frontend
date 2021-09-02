import React from "react";
import {
  AppStateActionType,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { Flags } from "../flags";
import { BigNumber } from "../lib/bignumber";
import { useVegaStaking } from "./use-vega-staking";
import { useVegaToken } from "./use-vega-token";
import { useVegaVesting } from "./use-vega-vesting";

export const useRefreshBalances = (address: string) => {
  const { appState, appDispatch } = useAppState();
  const vesting = useVegaVesting();
  const staking = useVegaStaking();
  const token = useVegaToken();

  return React.useCallback(async () => {
    const [balance, walletBalance, lien, allowance, vegaAssociatedBalance] =
      await Promise.all([
        vesting.getUserBalanceAllTranches(address),
        token.balanceOf(address),
        vesting.getLien(address),
        Flags.MAINNET_DISABLED
          ? new BigNumber(0)
          : token.allowance(address, appState.contractAddresses.stakingBridge),
        // Refresh connected vega key balances as well if we are connected to a vega key
        appState.currVegaKey?.pub
          ? staking.stakeBalance(address, appState.currVegaKey.pub)
          : null,
      ]);
    appDispatch({
      type: AppStateActionType.REFRESH_BALANCES,
      balance,
      walletBalance,
      allowance,
      lien,
      vegaAssociatedBalance,
    });
  }, [
    address,
    appDispatch,
    appState.contractAddresses.stakingBridge,
    appState.currVegaKey?.pub,
    staking,
    token,
    vesting,
  ]);
};
