import "./staking-node.scss";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ValidatorTable } from "./validator-table";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";

interface StakingNodeProps {
  vegaKey: VegaKeyExtended;
}

export const StakingNode = ({ vegaKey }: StakingNodeProps) => {
  const { t } = useTranslation();
  const { node } = useParams<{ node: string }>();

  return (
    <>
      <h1>{t("VALIDATOR {{node}}", { node })}</h1>
      <p>Vega key: {vegaKey.pubShort}</p>
      <ValidatorTable node={node} />
    </>
  );
};
