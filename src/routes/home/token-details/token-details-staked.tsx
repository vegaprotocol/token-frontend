import React from "react";
import { useVegaStaking } from "../../../hooks/use-vega-staking";
import {
  AppStateActionType,
  useAppState,
} from "../../../contexts/app-state/app-state-context";

export const TokenDetailsStaked = () => {
  const staking = useVegaStaking();
  const { appState, appDispatch } = useAppState();

  React.useEffect(() => {
    const run = async () => {
      const decimals = Decimals[appState.chainId!];
      const totalStaked = await staking.totalStaked();
      appDispatch({ type: "SET_TOTAL_STAKED", totalStaked, decimals });
    };
    run();
  }, [appDispatch, staking, appState.chainId]);

  return <td>{appState.totalStakedFormatted}</td>;
};
