import "./tranches.scss";
import { Link, useRouteMatch } from "react-router-dom";
import { TrancheDates } from "./tranche-dates";
import { useTranslation } from "react-i18next";
import { TrancheProgress } from "./tranche-progress";
import { BulletHeader } from "../../components/bullet-header";
import { useTranches } from "../../hooks/use-tranches";

export const Tranches = () => {
  const { t } = useTranslation();
  const match = useRouteMatch();
  const tranches = useTranches();

  return (
    <>
      <BulletHeader tag="h2">{t("Tranches")}</BulletHeader>
      {tranches?.length ? (
        <ul className="tranches__list">
          {tranches.map((tranche, i) => {
            return (
              <li className="tranches__list-item" key={i}>
                <div className="tranches__item-title">
                  <Link
                    to={`${match.url}/${tranche.tranche_id}`}
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
      ) : (
        <p>{t("No tranches")}</p>
      )}
    </>
  );
};
