import {
  VegaClaim,
  VegaErc20Bridge,
  VegaStaking,
  VegaToken,
  VegaVesting,
} from "@vegaprotocol/smart-contracts-sdk";
import React from "react";

import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { ADDRESSES } from "../../config";
import { useWeb3 } from "../../hooks/use-web3";
import { ContractsContext, ContractsContextShape } from "./contracts-context";

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
          staking: new VegaStaking(
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
