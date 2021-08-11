import React from "react";
import { format } from "date-fns";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { useTranslation } from "react-i18next";

interface ClaimInfoProps {
  tranche: Tranche;
}

export const ClaimInfo = ({ tranche }: ClaimInfoProps) => {
  const { t } = useTranslation();
  const showRedeem = ["1", "true"].includes(process.env.REACT_APP_REDEEM_LIVE!);
  const unlockDate = format(
    new Date(tranche.tranche_start).getTime(),
    "MMM d, yyyy"
  );
  const trancheEndDate = format(
    new Date(tranche.tranche_end).getTime(),
    "MMM d, yyyy"
  );
  const fullyRedeemable =
    new Date().getTime() > new Date(tranche.tranche_end).getTime();
  const partiallyRedeemable =
    !fullyRedeemable &&
    new Date().getTime() > new Date(tranche.tranche_start).getTime();
  const noneRedeemable = !fullyRedeemable && !partiallyRedeemable;

  return (
    <>
      {noneRedeemable && (
        <p>
          {t("tranche description", {
            unlockDate,
            trancheEndDate,
          })}{" "}
          {showRedeem && t("none redeemable")}
        </p>
      )}
      {partiallyRedeemable && (
        <p>
          {t("tranche description", {
            unlockDate,
            trancheEndDate,
          })}{" "}
          {showRedeem && t("partially redeemable")}
        </p>
      )}
      {fullyRedeemable && (
        <p>
          {t("Tokens in this tranche are fully unlocked.")}
          {showRedeem && t("fully redeemable")}
        </p>
      )}
    </>
  );
};
