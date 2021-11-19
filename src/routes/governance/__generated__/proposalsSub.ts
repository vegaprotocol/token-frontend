/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProposalState, ProposalRejectionReason, VoteValue } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL subscription operation: ProposalsSub
// ====================================================

export interface ProposalsSub_proposals_party {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
}

export interface ProposalsSub_proposals_terms_change_NewMarket_instrument {
  __typename: "InstrumentConfiguration";
  /**
   * Full and fairly descriptive name for the instrument
   */
  name: string;
}

export interface ProposalsSub_proposals_terms_change_NewMarket {
  __typename: "NewMarket";
  /**
   * New market instrument configuration
   */
  instrument: ProposalsSub_proposals_terms_change_NewMarket_instrument;
}

export interface ProposalsSub_proposals_terms_change_UpdateMarket {
  __typename: "UpdateMarket";
  marketId: string;
}

export interface ProposalsSub_proposals_terms_change_NewAsset_source_BuiltinAsset {
  __typename: "BuiltinAsset";
  /**
   * Maximum amount that can be requested by a party through the built-in asset faucet at a time
   */
  maxFaucetAmountMint: string;
}

export interface ProposalsSub_proposals_terms_change_NewAsset_source_ERC20 {
  __typename: "ERC20";
  /**
   * The address of the erc20 contract
   */
  contractAddress: string;
}

export type ProposalsSub_proposals_terms_change_NewAsset_source = ProposalsSub_proposals_terms_change_NewAsset_source_BuiltinAsset | ProposalsSub_proposals_terms_change_NewAsset_source_ERC20;

export interface ProposalsSub_proposals_terms_change_NewAsset {
  __typename: "NewAsset";
  /**
   * The symbol of the asset (e.g: GBP)
   */
  symbol: string;
  /**
   * the source of the new Asset
   */
  source: ProposalsSub_proposals_terms_change_NewAsset_source;
}

export interface ProposalsSub_proposals_terms_change_UpdateNetworkParameter_networkParameter {
  __typename: "NetworkParameter";
  /**
   * The name of the network parameter
   */
  key: string;
  /**
   * The value of the network parameter
   */
  value: string;
}

export interface ProposalsSub_proposals_terms_change_UpdateNetworkParameter {
  __typename: "UpdateNetworkParameter";
  networkParameter: ProposalsSub_proposals_terms_change_UpdateNetworkParameter_networkParameter;
}

export type ProposalsSub_proposals_terms_change = ProposalsSub_proposals_terms_change_NewMarket | ProposalsSub_proposals_terms_change_UpdateMarket | ProposalsSub_proposals_terms_change_NewAsset | ProposalsSub_proposals_terms_change_UpdateNetworkParameter;

export interface ProposalsSub_proposals_terms {
  __typename: "ProposalTerms";
  /**
   * RFC3339Nano time and date when voting closes for this proposal.
   * Constrained by "minClose" and "maxClose" network parameters.
   */
  closingDatetime: string;
  /**
   * RFC3339Nano time and date when this proposal is executed (if passed). Note that it has to be after closing date time.
   * Constrained by "minEnactInSeconds" and "maxEnactInSeconds" network parameters.
   */
  enactmentDatetime: string;
  /**
   * Actual change being introduced by the proposal - action the proposal triggers if passed and enacted.
   */
  change: ProposalsSub_proposals_terms_change;
}

export interface ProposalsSub_proposals_votes_yes_votes_party {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
}

export interface ProposalsSub_proposals_votes_yes_votes {
  __typename: "Vote";
  /**
   * The vote value cast
   */
  value: VoteValue;
  /**
   * The party casting the vote
   */
  party: ProposalsSub_proposals_votes_yes_votes_party;
  /**
   * RFC3339Nano time and date when the vote reached Vega network
   */
  datetime: string;
}

export interface ProposalsSub_proposals_votes_yes {
  __typename: "ProposalVoteSide";
  /**
   * Total tokens of governance token from the votes casted for this side
   */
  totalTokens: string;
  /**
   * Total number of votes casted for this side
   */
  totalNumber: string;
  /**
   * All votes casted for this side
   */
  votes: ProposalsSub_proposals_votes_yes_votes[] | null;
}

export interface ProposalsSub_proposals_votes_no_votes_party {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
}

export interface ProposalsSub_proposals_votes_no_votes {
  __typename: "Vote";
  /**
   * The vote value cast
   */
  value: VoteValue;
  /**
   * The party casting the vote
   */
  party: ProposalsSub_proposals_votes_no_votes_party;
  /**
   * RFC3339Nano time and date when the vote reached Vega network
   */
  datetime: string;
}

export interface ProposalsSub_proposals_votes_no {
  __typename: "ProposalVoteSide";
  /**
   * Total tokens of governance token from the votes casted for this side
   */
  totalTokens: string;
  /**
   * Total number of votes casted for this side
   */
  totalNumber: string;
  /**
   * All votes casted for this side
   */
  votes: ProposalsSub_proposals_votes_no_votes[] | null;
}

export interface ProposalsSub_proposals_votes {
  __typename: "ProposalVotes";
  /**
   * Yes votes cast for this proposal
   */
  yes: ProposalsSub_proposals_votes_yes;
  /**
   * No votes cast for this proposal
   */
  no: ProposalsSub_proposals_votes_no;
}

export interface ProposalsSub_proposals {
  __typename: "Proposal";
  /**
   * Proposal ID that is filled by VEGA once proposal reaches the network
   */
  id: string | null;
  /**
   * A UUID reference to aid tracking proposals on VEGA
   */
  reference: string;
  /**
   * State of the proposal
   */
  state: ProposalState;
  /**
   * RFC3339Nano time and date when the proposal reached Vega network
   */
  datetime: string;
  /**
   * Reason for the proposal to be rejected by the core
   */
  rejectionReason: ProposalRejectionReason | null;
  /**
   * Party that prepared the proposal
   */
  party: ProposalsSub_proposals_party;
  /**
   * Terms of the proposal
   */
  terms: ProposalsSub_proposals_terms;
  /**
   * Votes cast for this proposal
   */
  votes: ProposalsSub_proposals_votes;
}

export interface ProposalsSub {
  /**
   * Subscribe to proposals. Leave out all arguments to receive all proposals
   */
  proposals: ProposalsSub_proposals;
}
