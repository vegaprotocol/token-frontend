import "./reward-info.scss";
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
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
} from "../../../contexts/app-state/app-state-context";
import { useTranslation } from "react-i18next";
import { HTMLSelect, FormGroup } from "@blueprintjs/core";
import { BigNumber } from "../../../lib/bignumber";

interface RewardInfoProps {
  data: Rewards | undefined;
  currVegaKey: VegaKeyExtended;
  vegaKeys: VegaKeyExtended[];
  rewardAssetId: string;
}

// Note: For now the only reward type is Staking. We'll need this from the API
// at a later date
const DEFAULT_REWARD_TYPE = "Staking";

export const RewardInfo = ({
  data,
  currVegaKey,
  vegaKeys,
  rewardAssetId,
}: RewardInfoProps) => {
  const { t } = useTranslation();
  const { appDispatch } = useAppState();

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
      if (a.epoch > b.epoch) return -1;
      if (a.epoch < b.epoch) return 1;
      return 0;
    });

    return sorted;
  }, [data, rewardAssetId]);

  return (
    <div className="reward-info">
      <FormGroup label="Show rewards for Vega key">
        <HTMLSelect
          options={vegaKeys.map((k) => ({
            label: k.pub,
            value: k.pub,
          }))}
          value={currVegaKey.pub}
          onChange={(e) => {
            const key = vegaKeys.find((k) => k.pub === e.target.value);
            if (!key) throw new Error("Selected key not in key list");
            appDispatch({
              type: AppStateActionType.VEGA_WALLET_SET_KEY,
              key,
            });
          }}
        />
      </FormGroup>
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
    </div>
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

    const delegationsForEpoch = delegations
      .filter((d) => d.epoch === reward.epoch)
      .map((d) => new BigNumber(d.amountFormatted));

    if (delegationsForEpoch.length) {
      return BigNumber.sum.apply(null, [
        new BigNumber(0),
        ...delegationsForEpoch,
      ]);
    }

    return new BigNumber(0);
  }, [delegations, reward.epoch]);

  return (
    <div>
      <h3>
        {t("Epoch")} {reward.epoch}
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
          <td>
            {reward.amountFormatted} {t("VEGA")}
          </td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("shareOfReward")}</th>
          <td>{new BigNumber(reward.percentageOfTotal).dp(2).toString()}%</td>
        </KeyValueTableRow>
        {/*
        // TODO: re show when the receivedAt value is something sane.
        <KeyValueTableRow>
          <th>{t("received")}</th>
          <td>{format(new Date(reward.receivedAt), "dd MMM yyyy HH:mm")}</td>
        </KeyValueTableRow> */}
      </KeyValueTable>
    </div>
  );
};
