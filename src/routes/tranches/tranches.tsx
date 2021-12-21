import "./tranches.scss";

import { Tranche } from "@vegaprotocol/smart-contracts-sdk";
import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

import { ADDRESSES } from "../../config";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { TrancheItem } from "../redemption/tranche-item";
import { TrancheLabel } from "./tranche-label";

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
            return (
              <React.Fragment key={tranche.tranche_id}>
                <TrancheItem
                  link={`${match.path}/${tranche.tranche_id}`}
                  tranche={tranche}
                  locked={tranche.locked_amount}
                  unlocked={tranche.total_added.minus(tranche.locked_amount)}
                  total={tranche.total_added}
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
