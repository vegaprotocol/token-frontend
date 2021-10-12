import { Callout } from "../../components/callout";
import { Loader } from "../../components/loader";
import { StakeAction } from "./staking-form";
import { useTranslation } from "react-i18next";

interface StakePendingProps {
  action: StakeAction;
  amount: string;
  nodeId: string;
}

export const StakePending = ({ action, amount, nodeId }: StakePendingProps) => {
  const { t } = useTranslation();
  const titleArgs = { amount, node: nodeId };
  const title =
    action === "Add"
      ? t("Adding {{amount}} VEGA to node {{node}}", titleArgs)
      : t("Removing {{amount}} VEGA from node {{node}}", titleArgs);
  return (
    <Callout icon={<Loader />} title={title}>
      <p>
        {t("timeForConfirmation")}
      </p>
    </Callout>
  );
};
