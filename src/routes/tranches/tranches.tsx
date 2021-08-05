import "./tranches.scss";
import { Link } from "react-router-dom";
import { TrancheDates } from "./tranche-dates";
import { useTranslation } from "react-i18next";
import { TrancheProgress } from "./tranche-progress";
import { BulletHeader } from "./bullet-header";
import { useTranches } from "../../hooks/use-tranches";

export const Tranches = () => {
  const { t } = useTranslation();
  const tranches = useTranches();

  return (
    <>
      <BulletHeader tag="h2">{t("Tranches")}</BulletHeader>
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
