import React from "react";
import { useTranslation } from "react-i18next";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";
import "./locked-progress.scss";

export interface LockedProgressProps {
  total: BigNumber;
  locked: BigNumber;
  unlocked: BigNumber;
}

export const LockedProgress = ({
  total,
  locked,
  unlocked,
}: LockedProgressProps) => {
  const { t } = useTranslation();
  const lockedPercentage = React.useMemo(() => {
    return locked.div(total).times(100);
  }, [total, locked]);

  const unlockedPercentage = React.useMemo(() => {
    return unlocked.div(total).times(100);
  }, [total, unlocked]);

  return (
    <div className="tranche-item__progress">
      <div className="tranche-item__progress-bar">
        <div
          className="tranche-item__progress-bar--locked"
          style={{
            flex: isNaN(lockedPercentage.toNumber())
              ? 0
              : lockedPercentage.toNumber(),
          }}
        ></div>
        <div
          className="tranche-item__progress-bar--unlocked"
          style={{
            flex: isNaN(unlockedPercentage.toNumber())
              ? 0
              : unlockedPercentage.toNumber(),
          }}
        ></div>
      </div>
      <div className="tranche-item__progress-contents">
        <span>{t("Locked")}</span>
        <span>{t("Unlocked")}</span>
      </div>
      <div className="tranche-item__progress-contents">
        <span>{formatNumber(locked, 2)}</span>
        <span>{formatNumber(unlocked, 2)}</span>
      </div>
    </div>
  );
};
