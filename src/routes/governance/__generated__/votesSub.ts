/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BusEventType, VoteValue } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL subscription operation: votesSub
// ====================================================

export interface votesSub_busEvents_event_TimeUpdate {
  __typename: "TimeUpdate" | "MarketEvent" | "TransferResponses" | "PositionResolution" | "Order" | "Trade" | "Account" | "Party" | "MarginLevels" | "Proposal" | "MarketData" | "NodeSignature" | "LossSocialization" | "SettlePosition" | "Market" | "Asset" | "MarketTick" | "SettleDistressed" | "AuctionEvent" | "RiskFactor" | "Deposit" | "Withdrawal" | "OracleSpec" | "LiquidityProvision";
}

export interface votesSub_busEvents_event_Vote_party {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
}

export interface votesSub_busEvents_event_Vote {
  __typename: "Vote";
  /**
   * RFC3339Nano time and date when the vote reached Vega network
   */
  datetime: string;
  /**
   * The vote value cast
   */
  value: VoteValue;
  /**
   * The party casting the vote
   */
  party: votesSub_busEvents_event_Vote_party;
}

export type votesSub_busEvents_event = votesSub_busEvents_event_TimeUpdate | votesSub_busEvents_event_Vote;

export interface votesSub_busEvents {
  __typename: "BusEvent";
  /**
   * the type of event we're dealing with
   */
  type: BusEventType;
  /**
   * the payload - the wrapped event
   */
  event: votesSub_busEvents_event;
}

export interface votesSub {
  /**
   * Subscribe to event data from the event bus
   */
  busEvents: votesSub_busEvents[] | null;
}

export interface votesSubVariables {
  partyId: string;
}
