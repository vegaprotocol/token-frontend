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
  vested: BigNumber;
  total: BigNumber;
  message?: React.ReactNode;
  secondaryHeader?: React.ReactNode;
  link?: string;
}

export const TrancheItem = ({
  tranche,
  locked,
  vested,
  total,
  message,
  secondaryHeader,
  link
}: TrancheItemProps) => {
  const { t } = useTranslation();
  const lockedPercentage = React.useMemo(() => {
    return locked.div(total).times(100);
  }, [total, locked]);

  const vestedPercentage = React.useMemo(() => {
    return vested.div(total).times(100);
  }, [total, vested]);

  return (
    <section data-testid="tranche-item" className="tranche-item">
      <div className="tranche-item__header">
        {link ? (
          <Link to={link} className="tranches__link">
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
            className="tranche-item__progress-bar--vested"
            style={{
              flex:
                isNaN(vestedPercentage.toNumber()) ||
                !isFinite(vestedPercentage.toNumber())
                  ? 0
                  : vestedPercentage.toNumber(),
            }}
          ></div>
        </div>
        <div className="tranche-item__progress-contents">
          <span>{t("Locked")}</span>
          <span>{t("Unlocked")}</span>
        </div>
        <div className="tranche-item__progress-contents">
          <span>{locked.toString()}</span>
          <span>{vested.toString()}</span>
        </div>
      </div>

      <div className="tranche-item__footer" data-testid="tranche-item-footer">
        {message}
      </div>
    </section>
  );
};
