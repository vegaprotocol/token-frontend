/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum NodeStatus {
  NonValidator = "NonValidator",
  Validator = "Validator",
}

/**
 * Reason for the proposal being rejected by the core node
 */
export enum ProposalRejectionReason {
  CloseTimeTooLate = "CloseTimeTooLate",
  CloseTimeTooSoon = "CloseTimeTooSoon",
  CouldNotInstantiateMarket = "CouldNotInstantiateMarket",
  EnactTimeTooLate = "EnactTimeTooLate",
  EnactTimeTooSoon = "EnactTimeTooSoon",
  IncompatibleTimestamps = "IncompatibleTimestamps",
  InsufficientTokens = "InsufficientTokens",
  InvalidAsset = "InvalidAsset",
  InvalidAssetDetails = "InvalidAssetDetails",
  InvalidFeeAmount = "InvalidFeeAmount",
  InvalidFutureMaturityTimestamp = "InvalidFutureMaturityTimestamp",
  InvalidFutureProduct = "InvalidFutureProduct",
  InvalidInstrumentSecurity = "InvalidInstrumentSecurity",
  InvalidRiskParameter = "InvalidRiskParameter",
  InvalidShape = "InvalidShape",
  MajorityThresholdNotReached = "MajorityThresholdNotReached",
  MarketMissingLiquidityCommitment = "MarketMissingLiquidityCommitment",
  MissingBuiltinAssetField = "MissingBuiltinAssetField",
  MissingCommitmentAmount = "MissingCommitmentAmount",
  MissingERC20ContractAddress = "MissingERC20ContractAddress",
  NetworkParameterInvalidKey = "NetworkParameterInvalidKey",
  NetworkParameterInvalidValue = "NetworkParameterInvalidValue",
  NetworkParameterValidationFailed = "NetworkParameterValidationFailed",
  NoProduct = "NoProduct",
  NoRiskParameters = "NoRiskParameters",
  NoTradingMode = "NoTradingMode",
  NodeValidationFailed = "NodeValidationFailed",
  OpeningAuctionDurationTooLarge = "OpeningAuctionDurationTooLarge",
  OpeningAuctionDurationTooSmall = "OpeningAuctionDurationTooSmall",
  ParticipationThresholdNotReached = "ParticipationThresholdNotReached",
  ProductMaturityIsPassed = "ProductMaturityIsPassed",
  UnsupportedProduct = "UnsupportedProduct",
  UnsupportedTradingMode = "UnsupportedTradingMode",
}

/**
 * Various states a proposal can transition through:
 * Open ->
 * - Passed -> Enacted.
 * - Rejected.
 * Proposal can enter Failed state from any other state.
 */
export enum ProposalState {
  Declined = "Declined",
  Enacted = "Enacted",
  Failed = "Failed",
  Open = "Open",
  Passed = "Passed",
  Rejected = "Rejected",
  WaitingForNodeVote = "WaitingForNodeVote",
}

export enum VoteValue {
  No = "No",
  Yes = "Yes",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
