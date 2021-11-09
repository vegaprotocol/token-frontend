import React from "react";
import * as Sentry from "@sentry/react";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";
import {
  Rewards,
  Rewards_party_delegations,
  Rewards_party_rewardDetails_rewards,
} from "./__generated__/Rewards";
import { VegaKeyExtended } from "../../../contexts/app-state/app-state-context";

interface RewardInfoProps {
  data: Rewards | undefined;
  currVegaKey: VegaKeyExtended;
}

// Note: For now the only reward type is Staking. We'll need this from the API
// at a later date
const DEFAULT_REWARD_TYPE = "Staking";

export const RewardInfo = ({ data, currVegaKey }: RewardInfoProps) => {
  // Create array of rewards per epoch
  const vegaTokenRewards = React.useMemo(() => {
    if (!data?.party || !data.party.rewardDetails?.length) return [];

    // We only issue rewards as Vega tokens for now so there should only be one
    // item in the rewardDetails array
    if (data.party.rewardDetails.length > 1) {
      const rewardAssets = data.party.rewardDetails
        .map((r) => r?.asset.symbol)
        .join(", ");
      Sentry.captureMessage(`More than one reward asset ${rewardAssets}`);
    }

    // TODO: Get VEGA token rewards by finding by match of asset.id with network param reward.asset
    const vegaTokenRewards = data.party.rewardDetails[0];

    if (!vegaTokenRewards?.rewards?.length) return [];

    const sorted = Array.from(vegaTokenRewards.rewards).sort((a, b) => {
      if (!a || !b) return 0;
      if (Number(a?.epoch.id) > Number(b?.epoch.id)) return -1;
      if (Number(a?.epoch.id) < Number(b?.epoch.id)) return 1;
      return 0;
    });

    return sorted;
  }, [data]);

  if (!vegaTokenRewards.length) {
    return <p>This Vega key has not received any rewards.</p>;
  }

  return (
    <>
      <h2>Rewards for {currVegaKey?.pubShort}</h2>
      {vegaTokenRewards.map((reward, i) => {
        if (!reward) return null;
        return (
          <RewardTable
            key={i}
            reward={reward}
            delegations={data?.party?.delegations || []}
          />
        );
      })}
    </>
  );
};

interface RewardTableProps {
  reward: Rewards_party_rewardDetails_rewards;
  delegations: Rewards_party_delegations[];
}

export const RewardTable = ({ reward, delegations }: RewardTableProps) => {
  // Get your stake for epoch in which you have rewards
  const stakeForEpoch = React.useMemo(() => {
    if (!delegations.length) return "0";

    const delegationForEpoch = delegations.find(
      (d) => d.epoch === Number(reward.epoch.id)
    );

    if (delegationForEpoch) {
      return delegationForEpoch.amountFormatted;
    }

    return "0";
  }, [delegations, reward.epoch.id]);

  return (
    <div>
      <h3>Epoch {reward.epoch.id}</h3>
      <KeyValueTable>
        <KeyValueTableRow>
          <th>Reward type</th>
          <td>{DEFAULT_REWARD_TYPE}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>Your stake</th>
          <td>{stakeForEpoch.toString()}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>Reward</th>
          <td>{reward.amountFormatted} VEGA</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>Share of reward</th>
          <td>{reward.percentageOfTotal}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>Received</th>
          <td>{reward.receivedAt}</td>
        </KeyValueTableRow>
      </KeyValueTable>
    </div>
  );
};
