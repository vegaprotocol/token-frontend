import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Tick } from "../../components/icons";
import { Link } from "react-router-dom";
import { Routes } from "../router-config";
import { StakeAction } from "./staking-form";

interface StakeSuccessProps {
  action: StakeAction;
  amount: string;
  nodeId: string;
}

export const StakeSuccess = ({ action, amount, nodeId }: StakeSuccessProps) => {
  const { t } = useTranslation();
  const title =
    action === "Add"
      ? t("stakeAddSuccessMessage", { amount })
      : t("stakeRemoveSuccessMessage", { amount, node: nodeId });

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
