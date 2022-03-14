/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProposalState, ProposalRejectionReason, PeggedReference, PropertyKeyType, ConditionOperator, VoteValue } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL fragment: ProposalFields
// ====================================================

export interface ProposalFields_party {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
}

export interface ProposalFields_terms_change_NewFreeform {
  __typename: "NewFreeform";
}

export interface ProposalFields_terms_change_NewMarket_commitment_sells {
  __typename: "LiquidityOrder";
  /**
   * Offset from the pegged reference
   */
  offset: string;
  /**
   * The proportion of the commitment allocated to this order
   */
  proportion: number;
  /**
   * The value to which this order is tied
   */
  reference: PeggedReference;
}

export interface ProposalFields_terms_change_NewMarket_commitment_buys {
  __typename: "LiquidityOrder";
  /**
   * Offset from the pegged reference
   */
  offset: string;
  /**
   * The proportion of the commitment allocated to this order
   */
  proportion: number;
  /**
   * The value to which this order is tied
   */
  reference: PeggedReference;
}

export interface ProposalFields_terms_change_NewMarket_commitment {
  __typename: "NewMarketCommitment";
  /**
   * Specified as a unit-less number that represents the amount of settlement asset of the market
   */
  commitmentAmount: string;
  /**
   * Nominated liquidity fee factor, which is an input to the calculation of
   * taker fees on the market, as per setting fees and rewarding liquidity provider
   */
  fee: string;
  /**
   * A set of liquidity sell orders to meet the liquidity provision obligation
   */
  sells: ProposalFields_terms_change_NewMarket_commitment_sells[] | null;
  /**
   * A set of liquidity buy orders to meet the liquidity provision obligation
   */
  buys: ProposalFields_terms_change_NewMarket_commitment_buys[] | null;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct_settlementAsset {
  __typename: "Asset";
  /**
   * The full name of the asset (e.g: Great British Pound)
   */
  name: string;
  /**
   * The symbol of the asset (e.g: GBP)
   */
  symbol: string;
  /**
   * The id of the asset
   */
  id: string;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecBinding {
  __typename: "OracleSpecToFutureBinding";
  settlementPriceProperty: string;
  tradingTerminationProperty: string;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForSettlementPrice_filters_key {
  __typename: "PropertyKey";
  /**
   * name is the name of the property.
   */
  name: string | null;
  /**
   * type is the type of the property.
   */
  type: PropertyKeyType;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForSettlementPrice_filters_conditions {
  __typename: "Condition";
  /**
   * value is used by the comparator.
   */
  value: string | null;
  /**
   * comparator is the type of comparison to make on the value.
   */
  operator: ConditionOperator;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForSettlementPrice_filters {
  __typename: "Filter";
  /**
   * key is the oracle data property key targeted by the filter.
   */
  key: ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForSettlementPrice_filters_key;
  /**
   * conditions are the conditions that should be matched by the data to be
   * considered of interest.
   */
  conditions: ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForSettlementPrice_filters_conditions[] | null;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForSettlementPrice {
  __typename: "OracleSpecConfiguration";
  /**
   * pubKeys is the list of authorized public keys that signed the data for this
   * oracle. All the public keys in the oracle data should be contained in these
   * public keys.
   */
  pubKeys: string[] | null;
  /**
   * filters describes which oracle data are considered of interest or not for
   * the product (or the risk model).
   */
  filters: ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForSettlementPrice_filters[] | null;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForTradingTermination_filters_key {
  __typename: "PropertyKey";
  /**
   * name is the name of the property.
   */
  name: string | null;
  /**
   * type is the type of the property.
   */
  type: PropertyKeyType;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForTradingTermination_filters_conditions {
  __typename: "Condition";
  /**
   * value is used by the comparator.
   */
  value: string | null;
  /**
   * comparator is the type of comparison to make on the value.
   */
  operator: ConditionOperator;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForTradingTermination_filters {
  __typename: "Filter";
  /**
   * key is the oracle data property key targeted by the filter.
   */
  key: ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForTradingTermination_filters_key;
  /**
   * conditions are the conditions that should be matched by the data to be
   * considered of interest.
   */
  conditions: ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForTradingTermination_filters_conditions[] | null;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForTradingTermination {
  __typename: "OracleSpecConfiguration";
  /**
   * pubKeys is the list of authorized public keys that signed the data for this
   * oracle. All the public keys in the oracle data should be contained in these
   * public keys.
   */
  pubKeys: string[] | null;
  /**
   * filters describes which oracle data are considered of interest or not for
   * the product (or the risk model).
   */
  filters: ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForTradingTermination_filters[] | null;
}

export interface ProposalFields_terms_change_NewMarket_instrument_futureProduct {
  __typename: "FutureProduct";
  /**
   * Product asset ID
   */
  settlementAsset: ProposalFields_terms_change_NewMarket_instrument_futureProduct_settlementAsset;
  /**
   * String representing the quote (e.g. BTCUSD -> USD is quote)
   */
  quoteName: string;
  /**
   * OracleSpecToFutureBinding tells on which property oracle data should be
   * used as settlement price.
   */
  oracleSpecBinding: ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecBinding;
  /**
   * Describes the oracle data that an instrument wants to get from the oracle engine for settlement price.
   */
  oracleSpecForSettlementPrice: ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForSettlementPrice;
  /**
   * Describes the oracle data that an instrument wants to get from the oracle engine for trading termination.
   */
  oracleSpecForTradingTermination: ProposalFields_terms_change_NewMarket_instrument_futureProduct_oracleSpecForTradingTermination;
}

export interface ProposalFields_terms_change_NewMarket_instrument {
  __typename: "InstrumentConfiguration";
  /**
   * Full and fairly descriptive name for the instrument
   */
  name: string;
  /**
   * A short non necessarily unique code used to easily describe the instrument (e.g: FX:BTCUSD/DEC18)
   */
  code: string;
  /**
   * Future product specification
   */
  futureProduct: ProposalFields_terms_change_NewMarket_instrument_futureProduct | null;
}

export interface ProposalFields_terms_change_NewMarket {
  __typename: "NewMarket";
  /**
   * Decimal places used for the new market
   */
  decimalPlaces: number;
  /**
   * Metadata for this instrument, tags
   */
  metadata: string[] | null;
  /**
   * The liquidity commitment submitted with the new market
   */
  commitment: ProposalFields_terms_change_NewMarket_commitment | null;
  /**
   * New market instrument configuration
   */
  instrument: ProposalFields_terms_change_NewMarket_instrument;
}

export interface ProposalFields_terms_change_UpdateMarket {
  __typename: "UpdateMarket";
  marketId: string;
}

export interface ProposalFields_terms_change_NewAsset_source_BuiltinAsset {
  __typename: "BuiltinAsset";
  /**
   * Maximum amount that can be requested by a party through the built-in asset faucet at a time
   */
  maxFaucetAmountMint: string;
}

export interface ProposalFields_terms_change_NewAsset_source_ERC20 {
  __typename: "ERC20";
  /**
   * The address of the erc20 contract
   */
  contractAddress: string;
}

export type ProposalFields_terms_change_NewAsset_source = ProposalFields_terms_change_NewAsset_source_BuiltinAsset | ProposalFields_terms_change_NewAsset_source_ERC20;

export interface ProposalFields_terms_change_NewAsset {
  __typename: "NewAsset";
  /**
   * The symbol of the asset (e.g: GBP)
   */
  symbol: string;
  /**
   * the source of the new Asset
   */
  source: ProposalFields_terms_change_NewAsset_source;
}

export interface ProposalFields_terms_change_UpdateNetworkParameter_networkParameter {
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

export interface ProposalFields_terms_change_UpdateNetworkParameter {
  __typename: "UpdateNetworkParameter";
  networkParameter: ProposalFields_terms_change_UpdateNetworkParameter_networkParameter;
}

export type ProposalFields_terms_change = ProposalFields_terms_change_NewFreeform | ProposalFields_terms_change_NewMarket | ProposalFields_terms_change_UpdateMarket | ProposalFields_terms_change_NewAsset | ProposalFields_terms_change_UpdateNetworkParameter;

export interface ProposalFields_terms {
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
  change: ProposalFields_terms_change;
}

export interface ProposalFields_votes_yes_votes_party_stake {
  __typename: "PartyStake";
  /**
   * The stake currently available for the party
   */
  currentStakeAvailable: string;
}

export interface ProposalFields_votes_yes_votes_party {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
  /**
   * The staking information for this Party
   */
  stake: ProposalFields_votes_yes_votes_party_stake;
}

export interface ProposalFields_votes_yes_votes {
  __typename: "Vote";
  /**
   * The vote value cast
   */
  value: VoteValue;
  /**
   * The party casting the vote
   */
  party: ProposalFields_votes_yes_votes_party;
  /**
   * RFC3339Nano time and date when the vote reached Vega network
   */
  datetime: string;
}

export interface ProposalFields_votes_yes {
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
  votes: ProposalFields_votes_yes_votes[] | null;
}

export interface ProposalFields_votes_no_votes_party_stake {
  __typename: "PartyStake";
  /**
   * The stake currently available for the party
   */
  currentStakeAvailable: string;
}

export interface ProposalFields_votes_no_votes_party {
  __typename: "Party";
  /**
   * Party identifier
   */
  id: string;
  /**
   * The staking information for this Party
   */
  stake: ProposalFields_votes_no_votes_party_stake;
}

export interface ProposalFields_votes_no_votes {
  __typename: "Vote";
  /**
   * The vote value cast
   */
  value: VoteValue;
  /**
   * The party casting the vote
   */
  party: ProposalFields_votes_no_votes_party;
  /**
   * RFC3339Nano time and date when the vote reached Vega network
   */
  datetime: string;
}

export interface ProposalFields_votes_no {
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
  votes: ProposalFields_votes_no_votes[] | null;
}

export interface ProposalFields_votes {
  __typename: "ProposalVotes";
  /**
   * Yes votes cast for this proposal
   */
  yes: ProposalFields_votes_yes;
  /**
   * No votes cast for this proposal
   */
  no: ProposalFields_votes_no;
}

export interface ProposalFields {
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
   * Error details of the rejectionReason
   */
  errorDetails: string | null;
  /**
   * Party that prepared the proposal
   */
  party: ProposalFields_party;
  /**
   * Terms of the proposal
   */
  terms: ProposalFields_terms;
  /**
   * Votes cast for this proposal
   */
  votes: ProposalFields_votes;
}
