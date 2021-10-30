import React from "react";
import { ethers } from "ethers";
import { EthereumChainId } from "../../config";

interface Web3ContextShape {
  /**
   * Attempts to connect using web3modal, currently allows for injected
   * providers and WalletConnect supported wallets
   */
  connect: () => Promise<void>;

  /**
   * Disconnects connect Ethereum wallet and clears related cache items
   */
  disconnect: () => Promise<void>;

  /**
   * Provider to read from Ethereum chain. Defaults to using Infura, but once
   * connected to a wallet will use the wallets provider
   */
  provider: ethers.providers.BaseProvider;

  /**
   * Connected signer. Retrieved by calling provider.getSigner, can be null
   * if user hasn't connected their wallet
   */
  signer: ethers.Signer | null;

  /**
   * Current connected chain ID. When the provider is Infura it will use the
   * process.env.REACT_APP_CHAIN, when connected to a wallet it will use
   * whatever that wallet is connected to.
   */
  chainId: EthereumChainId;

  /** Ethereum address of the connected signer */
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
