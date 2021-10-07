import React from "react";
import Web3 from "web3";
import { EthereumChainId } from "../../config";

interface Web3ContextShape {
  provider: any;
  web3: Web3;
  chainId: EthereumChainId;
}

export const Web3Context = React.createContext<Web3ContextShape | undefined>(
  undefined
);

export function useWeb3() {
  const context = React.useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
}
