import "./tranches.scss";
import { Link, useRouteMatch } from "react-router-dom";
import { TrancheLabel } from "./tranche-label";
import { TrancheDates } from "./tranche-dates";
import { useTranslation } from "react-i18next";
import { TrancheProgress } from "./tranche-progress";
import { BulletHeader } from "../../components/bullet-header";
import React from "react";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { Callout } from "../../components/callout";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { ADDRESSES } from "../../config";

const trancheMinimum = 10;

const isTestingTranche = (t: Tranche) =>
  !t.total_added.isEqualTo(0) &&
  t.total_added.isLessThanOrEqualTo(trancheMinimum);

const shouldShowTranche = (t: Tranche) =>
  !t.total_added.isLessThanOrEqualTo(trancheMinimum);

export const Tranches = ({ tranches }: { tranches: Tranche[] }) => {
  const [showAll, setShowAll] = React.useState<boolean>(false);
  const { t } = useTranslation();
  const match = useRouteMatch();
  const filteredTranches = tranches?.filter(shouldShowTranche) || [];
  const { appState } = useAppState();

  const getContent = (tranche: Tranche) => {
    if (isTestingTranche(tranche)) {
      return (
        <Callout>
          {t(
            "This tranche was used to perform integration testing only prior to token launch and no tokens will enter the supply before 3rd Sep 2021."
          )}
        </Callout>
      );
    } else if (tranche.tranche_id === 10) {
      return (
        <Callout>
          {t(
            "This tranche unlocked prior to the token launch on 3rd Sept 2021. These tokens were all issued to institutions for distribution to purchasers, and to support listings and liquidity. They were unlocked early to ensure a smooth launch, but not sold or traded prior to the launch."
          )}
        </Callout>
      );
    }
    return (
      <TrancheDates start={tranche.tranche_start} end={tranche.tranche_end} />
    );
  };

  return (
    <>
      <BulletHeader tag="h2" style={{ marginTop: 0 }}>
        {t("Tranches")}
      </BulletHeader>
      {tranches?.length ? (
        <ul className="tranches__list">
          {(showAll ? tranches : filteredTranches).map((tranche) => {
            return (
              <li className="tranches__list-item" key={tranche.tranche_id}>
                <div className="tranches__list-item-container">
                  <div className="tranches__item-title">
                    <div className="tranches__item-line">
                      <Link
                        to={`${match.path}/${tranche.tranche_id}`}
                        className="tranches__link"
                      >
                        <span>{t("Tranche")}</span>#{tranche.tranche_id}
                      </Link>
                      {getContent(tranche)}
                    </div>
                  </div>
                  <TrancheProgress
                    locked={tranche.locked_amount}
                    totalRemoved={tranche.total_removed}
                    totalAdded={tranche.total_added}
                  />
                </div>
                <TrancheLabel
                  contract={ADDRESSES.vestingAddress}
                  chainId={appState.chainId}
                  id={tranche.tranche_id}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <p>{t("No tranches")}</p>
      )}
      <section className="tranches__message">
        <button className="button-link" onClick={() => setShowAll(!showAll)}>
          {showAll
            ? t(
                "Showing tranches with <{{trancheMinimum}} VEGA, click to hide these tranches",
                { trancheMinimum }
              )
            : t(
                "Not showing tranches with <{{trancheMinimum}} VEGA, click to show all tranches",
                { trancheMinimum }
              )}
        </button>
      </section>
    </>
  );
};
