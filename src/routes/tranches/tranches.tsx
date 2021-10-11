import "./tranches.scss";
import { useRouteMatch } from "react-router-dom";
import { TrancheLabel } from "./tranche-label";
import { useTranslation } from "react-i18next";
import React from "react";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { ADDRESSES } from "../../config";
import { TrancheItem } from "../redemption/tranche-item";
import { useWeb3 } from "../../contexts/web3-context/web3-context";

const trancheMinimum = 10;

const shouldShowTranche = (t: Tranche) =>
  !t.total_added.isLessThanOrEqualTo(trancheMinimum);

export const Tranches = ({ tranches }: { tranches: Tranche[] }) => {
  const [showAll, setShowAll] = React.useState<boolean>(false);
  const { t } = useTranslation();
  const match = useRouteMatch();
  const { chainId } = useWeb3();
  const filteredTranches = tranches?.filter(shouldShowTranche) || [];

  return (
    <>
      {tranches?.length ? (
        <ul className="tranches__list">
          {(showAll ? tranches : filteredTranches).map((tranche) => {
            const total = tranche.total_added.minus(tranche.total_removed);
            return (
              <React.Fragment key={tranche.tranche_id}>
                <TrancheItem
                  link={`${match.path}/${tranche.tranche_id}`}
                  tranche={tranche}
                  locked={tranche.locked_amount}
                  unlocked={total.minus(tranche.locked_amount)}
                  total={total}
                  secondaryHeader={
                    <TrancheLabel
                      contract={ADDRESSES.vestingAddress}
                      chainId={chainId}
                      id={tranche.tranche_id}
                    />
                  }
                />
              </React.Fragment>
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
