import { Callout } from "@vegaprotocol/ui-toolkit";
import { useTranslation } from "react-i18next";

import { Loader } from "../../components/loader";
import { StakeAction } from "./staking-form";

interface StakePendingProps {
  action: StakeAction;
  amount: string;
  nodeName: string;
}

export const StakePending = ({
  action,
  amount,
  nodeName,
}: StakePendingProps) => {
  const { t } = useTranslation();
  const titleArgs = { amount, node: nodeName };
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
