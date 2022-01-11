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
import { APP_ENV } from "../../config";
import { ContractsContext, ContractsContextShape } from "./contracts-context";

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const ContractsProvider = ({ children }: { children: JSX.Element }) => {
  const { library, account } = useWeb3React();
  const [contracts, setContracts] =
    React.useState<ContractsContextShape | null>(null);

  // Create instances of contract classes. If we have an account use a signer for the
  // contracts so that we can sign transactions, otherwise use the provider for just
  // reading data
  React.useEffect(() => {
    let provider = library;
    if (account && library && typeof library.getSigner === "function") {
      provider = library.getSigner();
    }
    if (provider) {
      setContracts({
        token: new VegaToken(provider, APP_ENV),
        staking: new VegaStaking(provider, APP_ENV),
        vesting: new VegaVesting(provider, APP_ENV),
        claim: new VegaClaim(provider, APP_ENV),
        erc20Bridge: new VegaErc20Bridge(provider, APP_ENV),
      });
    }
  }, [library, account]);

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
