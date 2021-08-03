import "./tranches.scss";
import { Loading } from "../../components/loading";
import { Link } from "react-router-dom";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { TrancheDates } from "./tranche-dates";
import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";
import { ProgressBar } from "./progress-bar";
import { getAbbreviatedNumber } from "../../lib/abbreviate-number";
import { TrancheProgress } from "./tranche-progress";

export const Tranches = ({ tranches }: { tranches: Tranche[] }) => {
  const { t } = useTranslation();

  if (tranches.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <h2 className="tranches__title">{t("Tranches")}</h2>
      <ul className="tranches__list">
        {tranches.map((tranche, i) => {
          return (
            <li className="tranches__list-item" key={i}>
              <div className="tranches__item-title">
                <Link
                  to={`/tranches/${tranche.tranche_id}`}
                  className="tranches__link"
                >
                  <span>{t("Tranche")}</span>#{tranche.tranche_id}
                </Link>
                <TrancheDates
                  start={tranche.tranche_start}
                  end={tranche.tranche_end}
                />
              </div>
              <TrancheProgress
                locked={tranche.locked_amount}
                totalRemoved={tranche.total_removed}
                totalAdded={tranche.total_added}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};
