import { useTranslation } from "react-i18next";
import { Callout } from "@vegaprotocol/ui-toolkit";
import { Tick } from "../../components/icons";
import { Routes } from "../router-config";
import { RemoveType, StakeAction } from "./staking-form";

interface StakeSuccessProps {
  action: StakeAction;
  amount: string;
  nodeName: string;
  removeType: RemoveType;
}

export const StakeSuccess = ({
  action,
  amount,
  nodeName,
  removeType,
}: StakeSuccessProps) => {
  const { t } = useTranslation();
  const isAdd = action === "Add";
  const title = isAdd
    ? t("stakeAddSuccessTitle", { amount })
    : t("stakeRemoveSuccessTitle", { amount, node: nodeName });
  const message = isAdd
    ? t("stakeAddSuccessMessage")
    : removeType === RemoveType.endOfEpoch
    ? t("stakeRemoveSuccessMessage")
    : t("stakeRemoveNowSuccessMessage");

  return (
    <Callout icon={<Tick />} intent="success" title={title}>
      <div>
        <p>{message}</p>
        <p>
          <Link to={Routes.STAKING}>{t("backToStaking")}</Link>
        </p>
      </div>
    </Callout>
  );
};
