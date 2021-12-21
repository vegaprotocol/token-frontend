import {
  IVegaClaim,
  IVegaErc20Bridge,
  IVegaStaking,
  IVegaToken,
  IVegaVesting,
} from "@vegaprotocol/smart-contracts-sdk";
import React from "react";

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
