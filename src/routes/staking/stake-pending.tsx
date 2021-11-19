import { Callout } from "../../components/callout";
import { Loader } from "../../components/loader";
import { RemoveType, StakeAction } from "./staking-form";
import { useTranslation } from "react-i18next";

interface StakePendingProps {
  action: StakeAction;
  amount: string;
  nodeName: string;
  removeType: RemoveType;
}

export const StakePending = ({
  action,
  amount,
  nodeName,
  removeType
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
      <p>
        {removeType === RemoveType.endOfEpoch
          ? t("timeForConfirmation")
          : t("timeForConfirmationNow")
        }
      </p>
    </Callout>
  );
};
