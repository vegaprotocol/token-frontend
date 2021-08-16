import "./tranches.scss";
import { Link, useRouteMatch } from "react-router-dom";
import { TrancheDates } from "./tranche-dates";
import { useTranslation } from "react-i18next";
import { TrancheProgress } from "./tranche-progress";
import { BulletHeader } from "../../components/bullet-header";
import { useTranches } from "../../hooks/use-tranches";
import React from "react";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { Callout } from "../../components/callout";

const trancheMinimum = 1;

const isTestingTranche = (t: Tranche) =>
  !t.total_added.isEqualTo(0) && t.total_added.isLessThan(trancheMinimum);

export const Tranches = () => {
  const [showAll, setShowAll] = React.useState<boolean>(false);
  const { t } = useTranslation();
  const match = useRouteMatch();
  const tranches = useTranches();
  const filteredTranches = tranches?.filter((t) => !isTestingTranche(t)) || [];
  return (
    <>
      <BulletHeader tag="h2">{t("Tranches")}</BulletHeader>
      {tranches?.length ? (
        <ul className="tranches__list">
          {(showAll ? tranches : filteredTranches).map((tranche, i) => {
            return (
              <>
                <li className="tranches__list-item" key={i}>
                  <div className="tranches__item-title">
                    <Link
                      to={`${match.path}/${tranche.tranche_id}`}
                      className="tranches__link"
                    >
                      <span>{t("Tranche")}</span>#{tranche.tranche_id}
                    </Link>
                    {isTestingTranche(tranche) ? (
                      <Callout>
                        This tranche was used to perform integration testing
                        only prior to token launch and no tokens will enter the
                        supply before 3rd Sep 2021.
                      </Callout>
                    ) : (
                      <TrancheDates
                        start={tranche.tranche_start}
                        end={tranche.tranche_end}
                      />
                    )}
                  </div>
                  <TrancheProgress
                    locked={tranche.locked_amount}
                    totalRemoved={tranche.total_removed}
                    totalAdded={tranche.total_added}
                  />
                </li>
              </>
            );
          })}
        </ul>
      ) : (
        <p>{t("No tranches")}</p>
      )}
      <section style={{ textAlign: "center" }}>
        <button
          className="tranches__button-link"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll
            ? `Showing tranches with <${trancheMinimum} VEGA, click to hide these tranches`
            : `Not showing tranches with <${trancheMinimum} VEGA, click to show all tranches`}
        </button>
      </section>
    </>
  );
};
