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
  const isAdd = action === "Add";
  const title = isAdd
    ? t("stakeAddPendingTitle", titleArgs)
    : t("stakeRemovePendingTitle", titleArgs);
  const message = isAdd ? t("stakeAddPendingMessage") : null;

  return (
    <Callout icon={<Loader />} title={title}>
      {message && <p>{message}</p>}
      <p>{t("timeForConfirmation")}</p>
    </Callout>
  );
};
