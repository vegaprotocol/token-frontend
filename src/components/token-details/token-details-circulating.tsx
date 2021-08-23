import React from "react";
import {useAppState} from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber"
import {Decimals} from "../../lib/web3-utils";
import {addDecimal} from "../../lib/decimals";

export const TokenDetailsCirculating = () => {
  const { appState } = useAppState()
  const decimals = Decimals[appState.chainId!]

  let totalCirculating: BigNumber = new BigNumber(0);

  appState.tranches?.forEach( tranche => totalCirculating = totalCirculating.plus(tranche.total_removed))

  return (<td>{addDecimal(totalCirculating, decimals)}</td>);
}
