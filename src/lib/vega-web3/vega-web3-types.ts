import { EthereumChainId } from "../web3-utils";
import { PromiEvent } from "web3-core";
import VegaClaim from "./vega-claim";
import { BigNumber } from "../bignumber";

export interface Tranche {
  tranche_id: number;
  tranche_start: Date;
  tranche_end: Date;
  total_added: BigNumber;
  total_removed: BigNumber;
  locked_amount: BigNumber;
  deposits: Array<TrancheDeposit>;
  withdrawals: Array<TrancheWithdrawal>;
  users: Array<any>;
}

export interface TrancheDeposit {
  amount: BigNumber;
  user: string;
  tx: string;
}

export interface TrancheWithdrawal {
  amount: BigNumber;
  user: string;
  tx: string;
}

export interface TrancheUser {
  address: string;
  deposits: Array<{
    amount: BigNumber;
    user: string;
    tx: string;
    tranche_id: number;
  }>;
  withdrawals: Array<{
    amount: BigNumber;
    user: string;
    tx: string;
    tranche_id: number;
  }>;
  total_tokens: BigNumber;
  withdrawn_tokens: BigNumber;
  remaining_tokens: BigNumber;
}

export enum TrancheEvents {
  Created = "Tranche_Created",
  BalanceAdded = "Tranche_Balance_Added",
  BalanceRemoved = "Tranche_Balance_Removed",
}

export interface ITokenParams {
  nonce: string;
  trancheId: string;
  expiry: string;
  target?: string;
  denomination: string;
  code: string;
}

export interface IVegaWeb3 {
  claim: VegaClaim;
  chainId: EthereumChainId;
  getAllTranches(): Promise<Tranche[]>;
  getUserBalanceAllTranches(account: string): Promise<string>;
  validateCode(params: ITokenParams): Promise<boolean>;
  commitClaim(): PromiEvent<any>;
}
