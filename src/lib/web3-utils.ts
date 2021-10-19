import { BigNumber } from "../lib/bignumber";
import { Tranche } from "./vega-web3/vega-web3-types";
import { EventEmitter } from "events";

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

export interface EpochDetails {
  id: string;
  startSeconds: BigNumber;
  endSeconds: BigNumber;
}

export declare class PromiEvent<T>
  extends EventEmitter
  implements PromiseLike<T>
{
  constructor(
    executor: (
      resolve: PromiEvent.Resolve<T>,
      reject: PromiEvent.Reject
    ) => void
  );

  public then<TResult1, TResult2>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2>;

  public catch<TResult>(
    onRejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<T | TResult>;

  public off(): this;

  public finally(onfinally?: (() => void) | null | undefined): Promise<T>;

  static resolve<T>(value: T): PromiEvent<T>;
  static reject<T>(reason: any): PromiEvent<T>;
}

declare namespace PromiEvent {
  export type Resolve<T> = (value?: T | PromiseLike<T>) => void;
  export type Reject = (reason?: any) => void;
}

export interface WrappedPromiEvent<T> {
  promiEvent: PromiEvent<T>;
}

export interface IStaking {
  stakeBalance(address: string, vegaKey: string): Promise<BigNumber>;
  totalStaked(): Promise<BigNumber>;
  removeStake(amount: string, vegaKey: string): Promise<any>;
  addStake(amount: string, vegaKey: string): Promise<any>;
}

export interface IVegaStaking extends IStaking {
  transferStake(
    amount: string,
    newAddress: string,
    vegaKey: string
  ): Promise<any>;
}

export interface IVegaVesting extends IStaking {
  getUserBalanceAllTranches(address: string): Promise<BigNumber>;
  getLien(address: string): Promise<BigNumber>;
  getAllTranches(): Promise<Tranche[]>;
  userTrancheTotalBalance(address: string, tranche: number): Promise<BigNumber>;
  userTrancheVestedBalance(
    address: string,
    tranche: number
  ): Promise<BigNumber>;
  withdrawFromTranche(account: string, trancheId: number): Promise<any>;
}

export interface IVegaClaim {
  commit(s: string, account: string): Promise<any>;

  checkCommit(s: string, account: string): Promise<boolean>;

  claim({
    amount,
    tranche,
    expiry,
    target,
    country,
    v,
    r,
    s,
    account,
  }: {
    amount: BigNumber;
    tranche: number;
    expiry: number;
    target?: string;
    country: string;
    v: number;
    r: string;
    s: string;
    account: string;
  }): Promise<any>;

  checkClaim({
    amount,
    tranche,
    expiry,
    target,
    country,
    v,
    r,
    s,
    account,
  }: {
    amount: BigNumber;
    tranche: number;
    expiry: number;
    target?: string;
    country: string;
    v: number;
    r: string;
    s: string;
    account: string;
  }): Promise<void>;

  isCommitted({ s, account }: { s: string; account: string }): Promise<string>;

  isExpired(expiry: number): Promise<boolean>;
  isUsed(s: string): Promise<boolean>;
  isCountryBlocked(country: string): Promise<boolean>;
}

export interface IVegaToken {
  totalSupply(): Promise<BigNumber>;
  decimals(): Promise<number>;
  tokenData(): Promise<{ totalSupply: BigNumber; decimals: number }>;
  balanceOf(address: string): Promise<BigNumber>;
  approve(spender: string): Promise<any>;
  allowance(address: string, spender: string): Promise<BigNumber>;
}

export interface IVegaLPStaking {
  stakedBalance(account: string): Promise<{
    pending: BigNumber;
    earningRewards: BigNumber;
    total: BigNumber;
  }>;
  rewardsBalance(account: string): Promise<BigNumber>;
  awardContractAddress(): Promise<string>;
  slpContractAddress(): Promise<string>;
  rewardPerEpoch(): Promise<BigNumber>;
  estimateAPY(): Promise<BigNumber>;
  totalStaked(): Promise<BigNumber>;
  totalUnstaked(account: string): Promise<BigNumber>;
  stake(amount: string): Promise<any>;
  unstake(): Promise<any>;
  withdrawRewards(): Promise<any>;
  allowance(account: string): Promise<BigNumber>;
  approve(spender: string): Promise<WrappedPromiEvent<boolean>>;
  liquidityTokensInRewardPool(): Promise<BigNumber>;
  currentEpochDetails(): Promise<EpochDetails>;
  stakingStart(): Promise<string>;
}

export interface TxError {
  message: string;
  code: number;
  data?: unknown;
}

/**
 * Error codes returned from Metamask that we can safely not capture in Sentry
 */
const IgnoreCodes = {
  ALREADY_PROCESSING: 32002,
  USER_REJECTED: 4001,
};

/**
 * Check if the error from web3/metamask is something expected we can handle
 * and thus not capture in Sentry
 */
export const isUnexpectedError = (error: Error | TxError) => {
  if ("code" in error && Object.values(IgnoreCodes).includes(error.code)) {
    return false;
  }
  return true;
};

/**
 * Check if the error from web3/metamask is the user rejecting connection or
 * a transaction confirmation prompt
 */
export const isUserRejection = (error: Error | TxError) => {
  if ("code" in error && error.code === IgnoreCodes.USER_REJECTED) {
    return true;
  }
  return false;
};
