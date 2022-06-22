/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Scores
// ====================================================

export interface Scores_epoch_validators_rewardScore {
  __typename: "RewardScore";
  /**
   * The composite score of the validator
   */
  validatorScore: string;
  /**
   * The normalised score of the validator
   */
  normalisedScore: string;
  /**
   * The performance score of the validator
   */
  performanceScore: string;
  /**
   * The stake based validator score with anti-whaling
   */
  rawValidatorScore: string;
  /**
   * The multisig score of the validator
   */
  multisigScore: string;
}

export interface Scores_epoch_validators {
  __typename: "Node";
  /**
   * The node url eg n01.vega.xyz
   */
  id: string;
  /**
   * Reward scores for the current epoch for the validator
   */
  rewardScore: Scores_epoch_validators_rewardScore | null;
}

export interface Scores_epoch {
  __typename: "Epoch";
  /**
   * Presumably this is an integer or something. If there's no such thing, disregard
   */
  id: string;
  /**
   * Validators that participated in this epoch
   */
  validators: Scores_epoch_validators[];
}

export interface Scores {
  /**
   * get data for a specific epoch, if id omitted it gets the current epoch. If the string is 'next', fetch the next epoch
   */
  epoch: Scores_epoch;
}

export interface ScoresVariables {
  epochId: string;
}
