import "./pending-stake.scss";

import { useTranslation } from "react-i18next";

import { BigNumber } from "../../lib/bignumber";

interface PendingStakeProps {
  pendingAmount: BigNumber;
}

export const PendingStake = ({ pendingAmount }: PendingStakeProps) => {
  const { t } = useTranslation();
  return (
    <div className="your-stake__container">
      <h2>{t("pendingNomination")}</h2>
      <p>{t("pendingNominationNextEpoch", { pendingAmount })}</p>
      <button type="button" className="button-secondary button-secondary--dark">
        {t("cancelPendingEpochNomination")}
      </button>
    </div>
  );
};
