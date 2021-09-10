import { BigNumber } from "../lib/bignumber";
import { Tranche } from "./vega-web3/vega-web3-types";

export type PromiEvent = typeof Promise & {
  on: (event: string, listener: (...args: any[]) => void) => PromiEvent;
  once: (event: string, listener: (...args: any[]) => void) => PromiEvent;
  off: (event?: string) => void;
};

export interface IStaking {
  stakeBalance(address: string, vegaKey: string): Promise<BigNumber>;
  totalStaked(): Promise<BigNumber>;
  removeStake(address: string, amount: string, vegaKey: string): PromiEvent;
  checkRemoveStake(
    address: string,
    amount: string,
    vegaKey: string
  ): Promise<any>;
  addStake(address: string, amount: string, vegaKey: string): PromiEvent;
  checkAddStake(address: string, amount: string, vegaKey: string): Promise<any>;
}

export interface IVegaStaking extends IStaking {
  checkTransferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
  ): Promise<any>;
  transferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
  ): PromiEvent;
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
  withdrawFromTranche(account: string, trancheId: number): PromiEvent;
  checkWithdrawFromTranche(account: string, trancheId: number): Promise<any>;
}

export interface IVegaClaim {
  commit(claimCode: string, account: string): PromiEvent;

  checkCommit(claimCode: string, account: string): Promise<any>;

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

export interface IVegaToken {
  totalSupply(): Promise<BigNumber>;
  decimals(): Promise<number>;
  tokenData(): Promise<{ totalSupply: BigNumber; decimals: number }>;
  balanceOf(address: string): Promise<BigNumber>;
  approve(address: string, spender: string): PromiEvent;
  allowance(address: string, spender: string): Promise<BigNumber>;
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
