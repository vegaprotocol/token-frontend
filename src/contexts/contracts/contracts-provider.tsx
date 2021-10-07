import React from "react";
import { useWeb3 } from "../web3-context/web3-context";
import { ContractsContext } from "./contracts-context";
import { ADDRESSES } from "../../config";
// @ts-ignore VEGA_WEB3 path swapped depending on prod build or test build
import VegaToken from "../../lib/VEGA_WEB3/vega-token";
// @ts-ignore
import StakingAbi from "../../lib/VEGA_WEB3/vega-staking";
import { useAppState } from "../app-state/app-state-context";

export const ContractsProvider = ({ children }: { children: JSX.Element }) => {
  const { web3 } = useWeb3();
  const {
    appState: { decimals },
  } = useAppState();

  const contracts = React.useMemo(() => {
    return {
      token: new VegaToken(web3, ADDRESSES.vegaTokenAddress),
      staking: new StakingAbi(web3, ADDRESSES.stakingBridge, decimals),
    };
  }, [web3, decimals]);

  return (
    <ContractsContext.Provider value={contracts}>
      {children}
    </ContractsContext.Provider>
  );
};
