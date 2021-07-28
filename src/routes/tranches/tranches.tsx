import React from "react";
import { Loading } from "../../components/loading";
import { Link } from "react-router-dom";
import { Tranche } from "../../lib/vega-web3-types";
import { TrancheDates } from "./tranche-dates";
import { useTranslation } from "react-i18next";

export const Tranches = ({ tranches }: { tranches: Tranche[] }) => {
  const { t } = useTranslation();

  const getAbbreviatedNumber = (num: number) => {
    if (num < 1000) {
      return Number(num.toFixed()).toLocaleString();
    } else if (num < 1000000) {
      return Number((num / 1000).toFixed()).toLocaleString() + "K";
    } else if (num < 1000000000) {
      return Number((num / 1000000).toFixed()).toLocaleString() + "M";
    }
    return Number((num / 1000000000).toFixed()).toLocaleString() + "B";
  };

  if (tranches.length === 0) {
    return <Loading />;
  }

  return (
    <div className="App">
      <div className="Inner">
        <div style={{ paddingBottom: 60 + "px" }}>
          <div className="TableHeading">
            <span className="Square"></span>
            <span className="SquareText">Tranches</span>
          </div>
          {tranches.map((tranche, i) => {
            let locked_percentage = Math.round(
              (tranche.locked_amount / tranche.total_added) * 100
            );
            let removed_percentage = Math.round(
              (tranche.total_removed / tranche.total_added) * 100
            );
            if (tranche.total_added === 0) {
              locked_percentage = 0;
              removed_percentage = 0;
            }
            return (
              <div className="TableRow" key={i}>
                <div className="Left">
                  <Link
                    to={`/tranches/${tranche.tranche_id}`}
                    className="TrancheLink"
                  >
                    <span className="TrancheTitle">{t("Tranche")}</span>
                    <span className="TrancheID">#{tranche.tranche_id}</span>
                  </Link>
                  <span className="TrancheDates">
                    <TrancheDates
                      start={tranche.tranche_start}
                      end={tranche.tranche_end}
                    />
                  </span>
                </div>
                <div className="Right">
                  <span className="ProgressTitle">{t("Locked")}</span>
                  <span className="ProgressBarHolder">
                    <div className="ProgressBar">
                      <div
                        style={{ width: locked_percentage + "%" }}
                        className="ProgressIndicatorPink"
                      ></div>
                    </div>
                  </span>
                  <span className="ProgressNumbers">
                    ({getAbbreviatedNumber(tranche.locked_amount)} of{" "}
                    {getAbbreviatedNumber(tranche.total_added)})
                  </span>
                  <span className="ProgressTitle">{t("Redeemed")}</span>
                  <span className="ProgressBarHolder">
                    <div className="ProgressBar">
                      <div
                        style={{ width: removed_percentage + "%" }}
                        className="ProgressIndicatorGreen"
                      ></div>
                    </div>
                  </span>
                  <span className="ProgressNumbers">
                    ({getAbbreviatedNumber(tranche.total_removed)} {t("of")}{" "}
                    {getAbbreviatedNumber(tranche.total_added)})
                  </span>
                </div>
                <div className="Clear"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
