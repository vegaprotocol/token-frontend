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
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

interface RewardInfoProps {
  data: Rewards | undefined;
  currVegaKey: VegaKeyExtended;
  rewardAssetId: string;
}

// Note: For now the only reward type is Staking. We'll need this from the API
// at a later date
const DEFAULT_REWARD_TYPE = "Staking";

export const RewardInfo = ({
  data,
  currVegaKey,
  rewardAssetId,
}: RewardInfoProps) => {
  const { t } = useTranslation();
  // Create array of rewards per epoch
  const vegaTokenRewards = React.useMemo(() => {
    if (!data?.party || !data.party.rewardDetails?.length) return [];

    const vegaTokenRewards = data.party.rewardDetails.find(
      (r) => r?.asset.id === rewardAssetId
    );

    // We only issue rewards as Vega tokens for now so there should only be one
    // item in the rewardDetails array
    if (!vegaTokenRewards) {
      const rewardAssets = data.party.rewardDetails
        .map((r) => r?.asset.symbol)
        .join(", ");
      Sentry.captureMessage(
        `Could not find VEGA token rewards ${rewardAssets}`
      );
      return [];
    }

    if (!vegaTokenRewards?.rewards?.length) return [];

    const sorted = Array.from(vegaTokenRewards.rewards).sort((a, b) => {
      if (!a || !b) return 0;
      if (Number(a?.epoch.id) > Number(b?.epoch.id)) return -1;
      if (Number(a?.epoch.id) < Number(b?.epoch.id)) return 1;
      return 0;
    });

    return sorted;
  }, [data, rewardAssetId]);

  return (
    <>
      <h2>
        {t("rewardsForVegaKey", {
          alias: currVegaKey.alias,
          key: currVegaKey.pubShort,
        })}
      </h2>
      {vegaTokenRewards.length ? (
        vegaTokenRewards.map((reward, i) => {
          if (!reward) return null;
          return (
            <RewardTable
              key={i}
              reward={reward}
              delegations={data?.party?.delegations || []}
            />
          );
        })
      ) : (
        <p>{t("noRewards")}</p>
      )}
    </>
  );
};

interface RewardTableProps {
  reward: Rewards_party_rewardDetails_rewards;
  delegations: Rewards_party_delegations[];
}

export const RewardTable = ({ reward, delegations }: RewardTableProps) => {
  const { t } = useTranslation();

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
      <h3>
        {t("Epoch")} {reward.epoch.id}
      </h3>
      <KeyValueTable>
        <KeyValueTableRow>
          <th>{t("rewardType")}</th>
          <td>{DEFAULT_REWARD_TYPE}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("yourStake")}</th>
          <td>{stakeForEpoch.toString()}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("reward")}</th>
          <td>{reward.amountFormatted} VEGA</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("shareOfReward")}</th>
          <td>{reward.percentageOfTotal}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("received")}</th>
          <td>{format(new Date(reward.receivedAt), "dd MMM yyyy HH:mm")}</td>
        </KeyValueTableRow>
      </KeyValueTable>
    </div>
  );
};
