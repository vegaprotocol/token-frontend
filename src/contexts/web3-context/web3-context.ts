import React from "react";
import { EthereumChainId } from "../../config";

interface Web3ContextShape {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  provider: any;
  signer: any;
  chainId: EthereumChainId;

  /** Ethereum address provided by injected provider/wallet connect */
  ethAddress: string;
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
