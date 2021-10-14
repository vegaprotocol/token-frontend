/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Rewards
// ====================================================

export interface Rewards_party_rewardDetails_asset {
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

export interface Rewards_party_rewardDetails_rewards {
  __typename: "Reward";
  /**
   * The asset for which this reward is associated
   */
  assetId: string;
  /**
   * Party receiving the reward
   */
  partyId: string;
  /**
   * Epoch for which this reward was distributed
   */
  epoch: number;
  /**
   * Amount received for this reward
   */
  amount: string;
  amountFormatted: string;
  /**
   * Percentage out of the total distributed reward
   */
  percentageOfTotal: string;
  /**
   * Time at which the rewards was received
   */
  receivedAt: string;
}

export interface Rewards_party_rewardDetails {
  __typename: "RewardPerAssetDetail";
  /**
   * Asset in which the reward was paid
   */
  asset: Rewards_party_rewardDetails_asset;
  /**
   * A list of rewards received for this asset
   */
  rewards: (Rewards_party_rewardDetails_rewards | null)[] | null;
  /**
   * The total amount of rewards received for this asset.
   */
  totalAmount: string;
}

export interface Rewards_party {
  __typename: "Party";
  /**
   * return reward information
   */
  rewardDetails: (Rewards_party_rewardDetails | null)[] | null;
}

export interface Rewards {
  /**
   * An entity that is trading on the VEGA network
   */
  party: Rewards_party | null;
}

export interface RewardsVariables {
  partyId: string;
}
