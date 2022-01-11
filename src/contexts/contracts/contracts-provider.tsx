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
  const { library, connector } = useWeb3React();
  const [contracts, setContracts] =
    React.useState<ContractsContextShape | null>(null);

  React.useEffect(() => {
    if (library) {
      setContracts({
        token: new VegaToken(library, APP_ENV),
        staking: new VegaStaking(library, APP_ENV),
        vesting: new VegaVesting(library, APP_ENV),
        claim: new VegaClaim(library, APP_ENV),
        erc20Bridge: new VegaErc20Bridge(library, APP_ENV),
      });
    }
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
