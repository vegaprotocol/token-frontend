/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: WithdrawPage
// ====================================================

export interface WithdrawPage_party_accounts_asset {
  __typename: "Asset";
  /**
   * The id of the asset
   */
  id: string;
  /**
   * The symbol of the asset (e.g: GBP)
   */
  symbol: string;
}

export interface WithdrawPage_party_accounts {
  __typename: "Account";
  /**
   * Balance as string - current account balance (approx. as balances can be updated several times per second)
   */
  balance: string;
  balanceFormatted: string;
  /**
   * Account type (General, Margin, etc)
   */
  type: AccountType;
  /**
   * Asset, the 'currency'
   */
  asset: WithdrawPage_party_accounts_asset;
}

export interface WithdrawPage_party {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
  /**
   * Collateral accounts relating to a party
   */
  accounts: WithdrawPage_party_accounts[] | null;
}

export interface WithdrawPage {
  /**
   * An entity that is trading on the VEGA network
   */
  party: WithdrawPage_party | null;
}

export interface WithdrawPageVariables {
  partyId: string;
}
