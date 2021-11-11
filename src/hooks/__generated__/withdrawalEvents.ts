/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BusEventType, WithdrawalStatus } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL subscription operation: WithdrawalEvents
// ====================================================

export interface WithdrawalEvents_busEvents_event_TimeUpdate {
  __typename: "TimeUpdate" | "MarketEvent" | "TransferResponses" | "PositionResolution" | "Order" | "Trade" | "Account" | "Party" | "MarginLevels" | "Proposal" | "Vote" | "MarketData" | "NodeSignature" | "LossSocialization" | "SettlePosition" | "Market" | "Asset" | "MarketTick" | "SettleDistressed" | "AuctionEvent" | "RiskFactor" | "Deposit" | "OracleSpec" | "LiquidityProvision";
}

export interface WithdrawalEvents_busEvents_event_Withdrawal_asset {
  __typename: "Asset";
  /**
   * The id of the asset
   */
  id: string;
  /**
   * The symbol of the asset (e.g: GBP)
   */
  symbol: string;
  /**
   * The precision of the asset
   */
  decimals: number;
}

export interface WithdrawalEvents_busEvents_event_Withdrawal_party {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
}

export interface WithdrawalEvents_busEvents_event_Withdrawal_details {
  __typename: "Erc20WithdrawalDetails";
  /**
   * The ethereum address of the receiver of the asset funds
   */
  receiverAddress: string;
}

export interface WithdrawalEvents_busEvents_event_Withdrawal {
  __typename: "Withdrawal";
  /**
   * The Vega internal id of the withdrawal
   */
  id: string;
  /**
   * The amount to be withdrawn
   */
  amount: string;
  /**
   * The current status of the withdrawal
   */
  status: WithdrawalStatus;
  /**
   * The asset to be withdrawn
   */
  asset: WithdrawalEvents_busEvents_event_Withdrawal_asset;
  /**
   * The PartyID initiating the witndrawal
   */
  party: WithdrawalEvents_busEvents_event_Withdrawal_party;
  /**
   * RFC3339Nano time at which the withdrawal was created
   */
  createdTimestamp: string;
  /**
   * RFC3339Nano time at which the withdrawal was finalized
   */
  withdrawnTimestamp: string | null;
  /**
   * Hash of the transaction on the foreign chain
   */
  txHash: string | null;
  /**
   * Foreign chain specific details about the withdrawal
   */
  details: WithdrawalEvents_busEvents_event_Withdrawal_details | null;
}

export type WithdrawalEvents_busEvents_event = WithdrawalEvents_busEvents_event_TimeUpdate | WithdrawalEvents_busEvents_event_Withdrawal;

export interface WithdrawalEvents_busEvents {
  __typename: "BusEvent";
  /**
   * the id for this event
   */
  eventId: string;
  /**
   * the block hash
   */
  block: string;
  /**
   * the type of event we're dealing with
   */
  type: BusEventType;
  /**
   * the payload - the wrapped event
   */
  event: WithdrawalEvents_busEvents_event;
}

export interface WithdrawalEvents {
  /**
   * Subscribe to event data from the event bus
   */
  busEvents: WithdrawalEvents_busEvents[] | null;
}

export interface WithdrawalEventsVariables {
  partyId: string;
}
