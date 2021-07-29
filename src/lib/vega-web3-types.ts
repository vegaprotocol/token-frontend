import { EthereumChainId } from "./vega-web3-utils";
import { PromiEvent } from "web3-core";

export interface Tranche {
  tranche_id: string;
  tranche_start: Date;
  tranche_end: Date;
  total_added: number;
  total_removed: number;
  locked_amount: number;
  deposits: Array<TrancheDeposit>;
  withdrawals: Array<TrancheWithdrawal>;
  users: Array<any>;
}

export interface TrancheDeposit {
  amount: number;
  user: string;
  tx: string;
}

export interface TrancheWithdrawal {
  amount: number;
  user: string;
  tx: string;
}

export interface TrancheUser {
  address: string;
  deposits: Array<{
    amount: number;
    user: string;
    tx: string;
    tranche_id: string;
  }>;
  withdrawals: Array<{
    amount: number;
    user: string;
    tx: string;
    tranche_id: string;
  }>;
  total_tokens: number;
  withdrawn_tokens: number;
  remaining_tokens: number;
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
  chainId: EthereumChainId;
  getAllTranches(): Promise<Tranche[]>;
  getUserBalanceAllTranches(account: string): Promise<string>;
  validateCode(params: ITokenParams): Promise<boolean>;
  commitClaim(): PromiEvent<any>;
}
