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
import { useWeb3 } from "../web3-context/web3-context";
import { ContractsContext, ContractsContextShape } from "./contracts-context";

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const ContractsProvider = ({ children }: { children: JSX.Element }) => {
  const { provider, signer } = useWeb3();
  const [contracts, setContracts] =
    React.useState<ContractsContextShape | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const token = new VegaToken(provider, signer, ADDRESSES.vegaTokenAddress);
      const decimals = await token.decimals();
      if (!cancelled) {
        setContracts({
          token,
          staking: new VegaStaking(
            provider,
            signer,
            ADDRESSES.stakingBridge,
            decimals
          ),
          vesting: new VegaVesting(
            provider,
            signer,
            ADDRESSES.vestingAddress,
            decimals
          ),
          erc20Bridge: new VegaErc20Bridge(
            provider,
            signer,
            ADDRESSES.erc20Bridge
          ),
          claim: new VegaClaim(
            provider,
            signer,
            ADDRESSES.claimAddress,
            decimals
          ),
        });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [provider, signer]);

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
