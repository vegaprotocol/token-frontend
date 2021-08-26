import React from "react";
import { StakingMethod } from "../../../components/staking-method-radio";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaVesting } from "../../../hooks/use-vega-vesting";
import { useVegaStaking } from "../../../hooks/use-vega-staking";
import { TxState } from "../../../hooks/transaction-reducer";
import { useRefreshBalances } from "../../../hooks/use-refresh-balances";

export const useRemoveStake = (
  address: string,
  amount: string,
  vegaKey: string,
  stakingMethod: StakingMethod | ""
) => {
  const vesting = useVegaVesting();
  const staking = useVegaStaking();
  const contractRemove = useTransaction(
    () => vesting.removeStake(address!, amount, vegaKey),
    () => vesting.checkRemoveStake(address!, amount, vegaKey)
  );
  const walletRemove = useTransaction(
    () => staking.removeStake(address!, amount, vegaKey),
    () => staking.checkRemoveStake(address!, amount, vegaKey)
  );
  const refreshBalances = useRefreshBalances(address, vegaKey);

  React.useEffect(() => {
    if (
      walletRemove.state.txState === TxState.Complete ||
      contractRemove.state.txState === TxState.Complete
    ) {
      refreshBalances();
    }
  }, [
    contractRemove.state.txState,
    refreshBalances,
    walletRemove.state.txState,
  ]);

  return React.useMemo(() => {
    if (stakingMethod === StakingMethod.Contract) {
      return walletRemove;
    } else {
      return contractRemove;
    }
  }, [contractRemove, stakingMethod, walletRemove]);
};
