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
  const isAdd = action === "Add";
  const title = isAdd
    ? t("stakeAddSuccessTitle", { amount })
    : t("stakeRemoveSuccessTitle", { amount, node: nodeId });
  const message = isAdd
    ? t("stakeAddSuccessMessage")
    : t("stakeRemoveSuccessMessage");

  return (
    <Callout icon={<Tick />} intent="success" title={title}>
      <div>
        <p>{message}</p>
        <p>
          <Link to={Routes.STAKING}>{t("Back to staking page")}</Link>
        </p>
      </div>
    </Callout>
  );
};
