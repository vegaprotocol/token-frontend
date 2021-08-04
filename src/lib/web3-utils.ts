import BigNumber from "bignumber.js";
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
    claimAddress: "0xd1Bdf85dB6Af63f45211dB95928d938abCc52dC8",
    lockedAddress: "0x78344c7305d73a7a0ac3c94cd9960f4449a1814e",
  },
  [EthereumChainIds.Ropsten]: {
    vestingAddress: "0xfc9Ad8fE9E0b168999Ee7547797BC39D55d607AA",
    vegaTokenAddress: "0xFa521aDcc11925266A518CdE33386FcD9cF2A4A6",
    claimAddress: "0x695eD7f6AcA81201d1D92107f120579CaAe2E5F2",
    // TODO: This will need updating once Emil has redployed the proxy
    lockedAddress: "0x1b7192491bf89d616676032656b2c7a55fd08e4c",
  },
};

export const Decimals = {
  [EthereumChainIds.Mainnet]: 18,
  [EthereumChainIds.Ropsten]: 5,
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
    denomination: BigNumber;
    trancheId: number;
    expiry: number;
    nonce: string;
    country: string;
    targeted: boolean;
    account: string;
  }): PromiEvent;
  checkClaim({
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
    denomination: BigNumber;
    trancheId: number;
    expiry: number;
    nonce: string;
    country: string;
    targeted: boolean;
    account: string;
  }): Promise<any>;
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
