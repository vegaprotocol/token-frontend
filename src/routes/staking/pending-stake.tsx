import "./pending-stake.scss";

import { useTranslation } from "react-i18next";

import { BigNumber } from "../../lib/bignumber";
import { RemoveType } from "./staking-form";

interface PendingStakeProps {
  pendingAmount: BigNumber;
  perform: () => void;
  setRemoveType: (removeType: RemoveType) => void;
  setAmount: React.Dispatch<any>;
}

export const PendingStake = ({
  pendingAmount,
  perform,
  setRemoveType,
  setAmount
}: PendingStakeProps) => {
  const { t } = useTranslation();
  const removeStakeNow = () => {
    setAmount(pendingAmount)
    setRemoveType(RemoveType.now);
    perform();
  };

  return (
    <div className="your-stake__container">
      <h2>{t("pendingNomination")}</h2>
      <p>{t("pendingNominationNextEpoch", { pendingAmount })}</p>
      <button
        type="button"
        className="button-secondary button-secondary--dark"
        onClick={removeStakeNow}
      >
        {t("cancelPendingEpochNomination")}
      </button>
    </div>
  );
};
