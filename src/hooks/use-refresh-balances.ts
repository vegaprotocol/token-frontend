import React from "react";
import {
  AppStateActionType,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { useVegaStaking } from "./use-vega-staking";
import { useVegaToken } from "./use-vega-token";
import { useVegaVesting } from "./use-vega-vesting";

export const useRefreshBalances = (address: string, vegaKey: string) => {
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
        token.allowance(address, appState.contractAddresses.stakingBridge),
        staking.stakeBalance(address, vegaKey),
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
    staking,
    token,
    vegaKey,
    vesting,
  ]);
};
