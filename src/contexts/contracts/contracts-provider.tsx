import {
  VegaClaim,
  VegaErc20Bridge,
  VegaStaking,
  VegaToken,
  VegaVesting,
} from "@vegaprotocol/smart-contracts-sdk";
import { useWeb3React } from "@web3-react/core";
import React from "react";

import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { ADDRESSES } from "../../config";
import { ContractsContext, ContractsContextShape } from "./contracts-context";

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const ContractsProvider = ({ children }: { children: JSX.Element }) => {
  const { library, connector } = useWeb3React();
  const [contracts, setContracts] =
    React.useState<ContractsContextShape | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (library && !cancelled) {
        const token = new VegaToken(
          library,
          library.getSigner(),
          ADDRESSES.vegaTokenAddress
        );
        const decimals = await token.decimals();
        setContracts({
          token,
          staking: new VegaStaking(
            library,
            library.getSigner(),
            ADDRESSES.stakingBridge,
            decimals
          ),
          vesting: new VegaVesting(
            library,
            library.getSigner(),
            ADDRESSES.vestingAddress,
            decimals
          ),
          claim: new VegaClaim(
            library,
            library.getSigner(),
            ADDRESSES.claimAddress,
            decimals
          ),
          erc20Bridge: new VegaErc20Bridge(
            library,
            library.getSigner(),
            ADDRESSES.erc20Bridge
          ),
        });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [library, connector]);

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
