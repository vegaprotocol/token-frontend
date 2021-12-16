import { IVegaClaim } from "@vegaprotocol/smart-contracts-sdk";
import React from "react";

import { IVegaErc20Bridge, IVegaToken } from "../../lib/web3-utils";
import { IVegaStaking } from "../../lib/web3-utils";
import { IVegaVesting } from "../../lib/web3-utils";

export interface ContractsContextShape {
  token: IVegaToken;
  staking: IVegaStaking;
  vesting: IVegaVesting;
  claim: IVegaClaim;
  erc20Bridge: IVegaErc20Bridge;
}

export const ContractsContext = React.createContext<
  ContractsContextShape | undefined
>(undefined);

export function useContracts() {
  const context = React.useContext(ContractsContext);
  if (context === undefined) {
    throw new Error("useContracts must be used within ContractsProvider");
  }
  return context;
}
