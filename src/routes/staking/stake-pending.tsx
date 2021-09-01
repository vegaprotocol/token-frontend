import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Loader } from "../../components/loader";

interface StakePendingProps {
  action: "Add" | "Remove" | undefined;
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
        {t(
          "This should take approximately 3 minutes to confirm, and then will be credited at the beginning of the next epoch"
        )}
      </p>
    </Callout>
  );
};
