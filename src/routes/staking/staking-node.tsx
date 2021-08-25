import "./staking-node.scss";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ValidatorTable } from "./validator-table";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { EpochCountdown } from "./epoch-countdown";
import { YourStake } from "./your-state";

interface StakingNodeProps {
  vegaKey: VegaKeyExtended;
}

export const StakingNode = ({ vegaKey }: StakingNodeProps) => {
  // TODO temp data
  const epochData = {
    count: 1,
    startDate: new Date(1626375300000),
    endDate: new Date(1629885333607),
  };
  const { t } = useTranslation();
  const { node } = useParams<{ node: string }>();

  return (
    <>
      <h2>{t("VALIDATOR {{node}}", { node })}</h2>
      <p>Vega key: {vegaKey.pubShort}</p>
      <ValidatorTable node={node} />
      <EpochCountdown
        containerClass="staking-node__epoch"
        count={epochData.count}
        startDate={epochData.startDate}
        endDate={epochData.endDate}
      />
      <YourStake node={node} />
    </>
  );
};
