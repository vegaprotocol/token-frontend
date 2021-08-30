import React from "react";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaVesting } from "../../../hooks/use-vega-vesting";
import { TxState } from "../../../hooks/transaction-reducer";
import { useVegaStaking } from "../../../hooks/use-vega-staking";
import { StakingMethod } from "../../../components/staking-method-radio";
import { useRefreshBalances } from "../../../hooks/use-refresh-balances";

export const useAddStake = (
  address: string,
  amount: string,
  vegaKey: string,
  stakingMethod: StakingMethod | ""
) => {
  const vesting = useVegaVesting();
  const staking = useVegaStaking();
  const contractAdd = useTransaction(
    () => vesting.addStake(address!, amount, vegaKey),
    () => vesting.checkAddStake(address!, amount, vegaKey)
  );
  const walletAdd = useTransaction(
    () => staking.addStake(address!, amount, vegaKey),
    () => staking.checkAddStake(address!, amount, vegaKey)
  );
  const refreshBalances = useRefreshBalances(address);

  React.useEffect(() => {
    if (
      walletAdd.state.txState === TxState.Complete ||
      contractAdd.state.txState === TxState.Complete
    ) {
      refreshBalances();
    }
  }, [contractAdd.state.txState, refreshBalances, walletAdd.state.txState]);

  return React.useMemo(() => {
    if (stakingMethod === StakingMethod.Contract) {
      return contractAdd;
    } else {
      return walletAdd;
    }
  }, [contractAdd, stakingMethod, walletAdd]);
};
