import React from "react";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../../components/key-value-table";
import { Rewards } from "./__generated__/Rewards";

interface RewardInfoProps {
  data: Rewards | undefined;
}

export const RewardInfo = ({ data }: RewardInfoProps) => {
  const vegaTokenRewards = React.useMemo(() => {
    console.log(data);
    if (!data?.party || !data.party.rewardDetails?.length) return [];

    const vegaTokenRewards = data.party.rewardDetails[0];

    if (!vegaTokenRewards?.rewards?.length) return [];

    const sorted = vegaTokenRewards.rewards.sort((a, b) => {
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
