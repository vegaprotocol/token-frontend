import React from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { BigNumber } from "../../lib/bignumber";
import { Link } from "react-router-dom";

import "./tranche-item.scss";

export interface TrancheItemProps {
  tranche: {
    tranche_id: number;
    tranche_start: Date;
    tranche_end: Date;
  };
  locked: BigNumber;
  unlocked: BigNumber;
  total: BigNumber;
  message?: React.ReactNode;
  secondaryHeader?: React.ReactNode;
  link?: string;
}

export const TrancheItem = ({
  tranche,
  locked,
  unlocked,
  total,
  message,
  secondaryHeader,
  link,
}: TrancheItemProps) => {
  const { t } = useTranslation();
  const lockedPercentage = React.useMemo(() => {
    return locked.div(total).times(100);
  }, [total, locked]);

  const unlockedPercentage = React.useMemo(() => {
    return unlocked.div(total).times(100);
  }, [total, unlocked]);

  return (
    <section data-testid="tranche-item" className="tranche-item">
      <div className="tranche-item__header">
        {link ? (
          <Link to={link}>
            <span className="tranche-item__label">
              {t("Tranche")} {tranche.tranche_id}
            </span>
          </Link>
        ) : (
          <span className="tranche-item__label">
            {t("Tranche")} {tranche.tranche_id}
          </span>
        )}
        {secondaryHeader ? (
          <span className="tranche-item__secondary-label">
            {secondaryHeader}
          </span>
        ) : null}
        <span>{total.toString()}</span>
      </div>
      <table>
        <tbody>
          <tr>
            <td>{t("Starts unlocking")}</td>
            <td>{format(tranche.tranche_start, "d MMM yyyy")}</td>
            <td></td>
          </tr>
          <tr>
            <td>{t("Fully unlocked")}</td>
            <td>{format(tranche.tranche_end, "d MMM yyyy")}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div className="tranche-item__progress">
        <div className="tranche-item__progress-bar">
          <div
            className="tranche-item__progress-bar--locked"
            style={{
              flex:
                isNaN(lockedPercentage.toNumber()) ||
                !isFinite(lockedPercentage.toNumber())
                  ? 0
                  : lockedPercentage.toNumber(),
            }}
          ></div>
          <div
            className="tranche-item__progress-bar--unlocked"
            style={{
              flex:
                isNaN(unlockedPercentage.toNumber()) ||
                !isFinite(unlockedPercentage.toNumber())
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
          <span>{locked.toString()}</span>
          <span>{unlocked.toString()}</span>
        </div>
      </div>

      <div className="tranche-item__footer" data-testid="tranche-item-footer">
        {message}
      </div>
    </section>
  );
};
