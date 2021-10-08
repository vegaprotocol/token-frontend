import React from "react";
import { useWeb3 } from "../web3/web3-context";
import { ContractsContext } from "./contracts-context";
import { ADDRESSES } from "../../config";
import { useAppState } from "../app-state/app-state-context";

// Note: Each contract class imported below gets swapped out for a mocked version
// at ../../lib/vega-web3/__mocks__ at build time using webpack.NormalModuleReplacementPlugin
// when you run the app with REACT_APP_MOCKED=1

// @ts-ignore
import VegaToken from "../../lib/VEGA_WEB3/vega-token";
// @ts-ignore
import StakingAbi from "../../lib/VEGA_WEB3/vega-staking";
// @ts-ignore
import VegaVesting from "../../lib/VEGA_WEB3/vega-vesting";
// @ts-ignore
import VegaClaim from "../../lib/VEGA_WEB3/vega-claim";

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const ContractsProvider = ({ children }: { children: JSX.Element }) => {
  const { web3 } = useWeb3();
  const {
    appState: { decimals },
  } = useAppState();

  const contracts = React.useMemo(() => {
    return {
      token: new VegaToken(web3, ADDRESSES.vegaTokenAddress),
      staking: new StakingAbi(web3, ADDRESSES.stakingBridge, decimals),
      vesting: new VegaVesting(web3, ADDRESSES.vestingAddress, decimals),
      claim: new VegaClaim(web3, ADDRESSES.claimAddress, decimals),
    };
  }, [web3, decimals]);

  return (
    <ContractsContext.Provider value={contracts}>
      {children}
    </ContractsContext.Provider>
  );
};
