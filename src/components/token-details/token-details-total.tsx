import React from "react";
import {BigNumber} from "../../lib/bignumber";
import {useAppState} from "../../contexts/app-state/app-state-context";
import {useVegaVesting} from "../../hooks/use-vega-vesting";

export const TokenDetailsTotal = ({ totalSupplyFormatted }: { totalSupplyFormatted: string | null}) => {
  const vesting = useVegaVesting();
  const { appState, appDispatch } = useAppState();

  React.useEffect(() => {
    const run = async () => {
      if (!totalSupplyFormatted) {
        const allTranches = await vesting.getAllTranches();
        appDispatch({type: "SET_TOTAL_SUPPLY", totalSupply: new BigNumber(allTranches[0].total_added)});
      }
    };

    run();
  }, [appDispatch, vesting, totalSupplyFormatted]);

  if (!appState.totalSupplyFormatted) {
    return (<td>...</td>)
  }

  return (<td>{appState.totalSupplyFormatted}</td>)
}
