import "./tranche.scss";
import { useParams } from "react-router";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Routes } from "../router-config";
import { Tranche as TrancheType } from "../../lib/vega-web3/vega-web3-types";
import { useWeb3 } from "../../contexts/web3/web3-context";
import { EtherscanLink } from "../../components/etherscan-link";
import { TrancheItem } from "../redemption/tranche-item";
import { TrancheLabel } from "./tranche-label";
import { ADDRESSES } from "../../config";
import React from "react";
import { BigNumber } from "../../lib/bignumber";
import { formatNumber } from "../../lib/format-number";

export const Tranche = ({ tranches }: { tranches: TrancheType[] }) => {
  const { t } = useTranslation();
  const { trancheId } = useParams<{ trancheId: string }>();
  const { chainId } = useWeb3();
  const tranche = tranches.find(
    (tranche) => tranche.tranche_id === parseInt(trancheId)
  );

  const lockedData = React.useMemo(() => {
    if (!tranche) return null;
    const locked = tranche.locked_amount.div(tranche.total_added);
    return {
      locked,
      unlocked: new BigNumber(1).minus(locked),
    };
  }, [tranche]);

  if (!tranche) {
    return <Redirect to={Routes.NOT_FOUND} />;
  }

  return (
    <>
      <TrancheItem
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
      <div className="tranche__redeemed">
        <span>{t("alreadyRedeemed")}</span>
        <span>{tranche.total_removed.toString()}</span>
      </div>
      <h2>{t("Holders")}</h2>
      {tranche.users.length ? (
        <ul className="tranche__user-list">
          {tranche.users.map((user, i) => {
            const unlocked = user.remaining_tokens.times(lockedData?.unlocked);
            const locked = user.remaining_tokens.times(lockedData?.locked);
            return (
              <li className="tranche__user-list--item" key={i}>
                <EtherscanLink
                  chainId={chainId}
                  address={user.address}
                  text={user.address}
                />
                <div className="tranche__progress-contents">
                  <span>{t("Locked")}</span>
                  <span>{t("Unlocked")}</span>
                </div>
                <div className="tranche__progress-contents">
                  <span>{formatNumber(locked)}</span>
                  <span>{formatNumber(unlocked)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>{t("No users")}</p>
      )}
    </>
  );
};
