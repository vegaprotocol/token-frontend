import React from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { BigNumber } from "../../lib/bignumber";

export interface TrancheItemProps {
  tranche: {
    tranche_id: number;
    tranche_start: Date;
    tranche_end: Date;
  };
  locked: BigNumber;
  vested: BigNumber;
  total: BigNumber;
  message: React.ReactNode;
}

export const TrancheItem = ({tranche, locked, vested, total, message}: TrancheItemProps) => {
  const { t } = useTranslation();
    const lockedPercentage = React.useMemo(() => {
      return locked.div(total).times(100);
    }, [total, locked]);

    const vestedPercentage = React.useMemo(() => {
      return vested.div(total).times(100);
    }, [total, vested]);

  return (
    <section data-testid="tranche-table" className="tranche-table">
      <div className="tranche-table__header">
        <span className="tranche-table__label">
          {t("Tranche")} {tranche.tranche_id}
        </span>
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
      <div className="tranche-table__progress">
        <div className="tranche-table__progress-bar">
          <div
            className="tranche-table__progress-bar--locked"
            style={{ flex: lockedPercentage.toNumber() }}
          ></div>
          <div
            className="tranche-table__progress-bar--vested"
            style={{ flex: vestedPercentage.toNumber() }}
          ></div>
        </div>
        <div className="tranche-table__progress-contents">
          <span>{t("Locked")}</span>
          <span>{t("Unlocked")}</span>
        </div>
        <div className="tranche-table__progress-contents">
          <span>{locked.toString()}</span>
          <span>{vested.toString()}</span>
        </div>
      </div>

      <div className="tranche-table__footer" data-testid="tranche-table-footer">
        {message}
      </div>
    </section>
  );
}