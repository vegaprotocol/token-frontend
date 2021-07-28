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
}
