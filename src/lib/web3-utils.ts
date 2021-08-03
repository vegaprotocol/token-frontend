import type BN from "bn.js";
import { Tranche } from "./vega-web3/vega-web3-types";

export type EthereumChainId = "0x1" | "0x3" | "0x4" | "0x5" | "0x2a";
export type EthereumChainName =
  | "Mainnet"
  | "Ropsten"
  | "Rinkeby"
  | "Goerli"
  | "Kovan";

export const EthereumChainNames: Record<EthereumChainId, EthereumChainName> = {
  "0x1": "Mainnet",
  "0x3": "Ropsten",
  "0x4": "Rinkeby",
  "0x5": "Goerli",
  "0x2a": "Kovan",
};

export const EthereumChainIds: Record<EthereumChainName, EthereumChainId> = {
  Mainnet: "0x1",
  Ropsten: "0x3",
  Rinkeby: "0x4",
  Goerli: "0x5",
  Kovan: "0x2a",
};

export const Addresses = {
  [EthereumChainIds.Mainnet]: {
    vestingAddress: "0x23d1bFE8fA50a167816fBD79D7932577c06011f4",
    vegaTokenAddress: "0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e",
    claimAddress: "",
    lockedAddress: "0x78344c7305d73a7a0ac3c94cd9960f4449a1814e",
  },
  [EthereumChainIds.Ropsten]: {
    vestingAddress: "0x08C06ECDCf9b8f45e3cF1ec29B82eFd0171341D9",
    vegaTokenAddress: "0x16480156222D4525f02F0F2BdF8A45A23bd26431",
    claimAddress: "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21",
    lockedAddress: "0x1b7192491bf89d616676032656b2c7a55fd08e4c",
  },
};

export type PromiEvent = typeof Promise & {
  on: (event: string, listener: (...args: any[]) => void) => PromiEvent;
  once: (event: string, listener: (...args: any[]) => void) => PromiEvent;
};

export interface IVegaVesting {
  getUserBalanceAllTranches(account: string): Promise<string>;
  getAllTranches(): Promise<Tranche[]>;
}

export interface IVegaClaim {
  commit(claimCode: string, account: string): PromiEvent;
  claim({
    claimCode,
    denomination,
    trancheId,
    expiry,
    nonce,
    country,
    targeted,
    account,
  }: {
    claimCode: string;
    denomination: BN;
    trancheId: number;
    expiry: number;
    nonce: string;
    country: string;
    targeted: boolean;
    account: string;
  }): PromiEvent;
  isCommitted({
    claimCode,
    account,
  }: {
    claimCode: string;
    account: string;
  }): Promise<boolean>;

  isExpired(expiry: number): Promise<boolean>;
  isUsed(nonce: string): Promise<boolean>;
  isCountryBlocked(country: string): Promise<boolean>;
}
