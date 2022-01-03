import { useWeb3 } from "../../hooks/use-web3";
import React from "react";

import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { ADDRESSES } from "../../config";
// @ts-ignore
import VegaClaim from "../../lib/VEGA_WEB3/vega-claim";
// @ts-ignore
import StakingAbi from "../../lib/VEGA_WEB3/vega-staking";
// Note: Each contract class imported below gets swapped out for a mocked version
// at ../../lib/vega-web3/__mocks__ at build time using webpack.NormalModuleReplacementPlugin
// when you run the app with REACT_APP_MOCKED=1
// @ts-ignore
import VegaToken from "../../lib/VEGA_WEB3/vega-token";
// @ts-ignore
import VegaVesting from "../../lib/VEGA_WEB3/vega-vesting";
import { ContractsContext, ContractsContextShape } from "./contracts-context";
import { VegaErc20Bridge } from "@vegaprotocol/smart-contracts-sdk";

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const ContractsProvider = ({ children }: { children: JSX.Element }) => {
  const { library } = useWeb3();
  const [contracts, setContracts] =
    React.useState<ContractsContextShape | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const token = new VegaToken(library, library, ADDRESSES.vegaTokenAddress);
      const decimals = await token.decimals();
      if (!cancelled) {
        setContracts({
          token,
          staking: new StakingAbi(
            library,
            library,
            ADDRESSES.stakingBridge,
            decimals
          ),
          vesting: new VegaVesting(
            library,
            library,
            ADDRESSES.vestingAddress,
            decimals
          ),
          claim: new VegaClaim(
            library,
            library,
            ADDRESSES.claimAddress,
            decimals
          ),
          erc20Bridge: new VegaErc20Bridge(
            library,
            library,
            ADDRESSES.erc20Bridge
          ),
        });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [library]);

  if (!contracts) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <ContractsContext.Provider value={contracts}>
      {children}
    </ContractsContext.Provider>
  );
};
