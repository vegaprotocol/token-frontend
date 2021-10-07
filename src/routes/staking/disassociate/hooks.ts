import React from "react";
import { StakingMethod } from "../../../components/staking-method-radio";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaVesting } from "../../../hooks/use-vega-vesting";
import { TxState } from "../../../hooks/transaction-reducer";
import { useRefreshBalances } from "../../../hooks/use-refresh-balances";
import { useContracts } from "../../../contexts/contracts/contracts-context";

export const useRemoveStake = (
  address: string,
  amount: string,
  vegaKey: string,
  stakingMethod: StakingMethod | ""
) => {
  const vesting = useVegaVesting();
  const { staking } = useContracts();
  const contractRemove = useTransaction(
    () => vesting.removeStake(address!, amount, vegaKey),
    () => vesting.checkRemoveStake(address!, amount, vegaKey)
  );
  const walletRemove = useTransaction(
    () => staking.removeStake(address!, amount, vegaKey),
    () => staking.checkRemoveStake(address!, amount, vegaKey)
  );
  const refreshBalances = useRefreshBalances(address);

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
      return contractRemove;
    } else {
      return walletRemove;
    }
  }, [contractRemove, stakingMethod, walletRemove]);
};
