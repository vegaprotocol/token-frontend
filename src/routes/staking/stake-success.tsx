import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Tick } from "../../components/icons";
import { Link } from "react-router-dom";
import { Routes } from "../router-config";

interface StakeSuccessProps {
  action: "Add" | "Remove" | undefined;
  amount: string;
  nodeId: string;
}

export const StakeSuccess = ({ action, amount, nodeId }: StakeSuccessProps) => {
  const { t } = useTranslation();
  const titleArgs = { amount, node: nodeId };
  const title =
    action === "Add"
      ? t("{{amount}} VEGA has been added to node {{node}}", titleArgs)
      : t("{{amount}} VEGA has been removed from node {{node}}", titleArgs);

  return (
    <Callout icon={<Tick />} intent="success" title={title}>
      <div>
        <p>{t("It will be applied in the next epoch")}</p>
        <p>
          <Link to={Routes.STAKING}>{t("Back to staking page")}</Link>
        </p>
      </div>
    </Callout>
  );
};
