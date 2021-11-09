import React from "react";
import * as Sentry from "@sentry/react";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";
import { Rewards } from "./__generated__/Rewards";

interface RewardInfoProps {
  data: Rewards | undefined;
}

export const RewardInfo = ({ data }: RewardInfoProps) => {
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
      {vegaTokenRewards.map((reward, i) => {
        return (
          <div key={i}>
            <h3>Epoch {reward?.epoch.id}</h3>
            <KeyValueTable>
              <KeyValueTableRow>
                <th>Reward</th>
                <td>{reward?.amountFormatted} VEGA</td>
              </KeyValueTableRow>
              <KeyValueTableRow>
                <th>Share of reward</th>
                <td>{reward?.percentageOfTotal}</td>
              </KeyValueTableRow>
              <KeyValueTableRow>
                <th>Received</th>
                <td>{reward?.receivedAt}</td>
              </KeyValueTableRow>
            </KeyValueTable>
          </div>
        );
      })}
    </>
  );
};
