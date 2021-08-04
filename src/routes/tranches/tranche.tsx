import "./tranche.scss";
import React from "react";
import { useParams } from "react-router";
import { Loading } from "../../components/loading";
import type { Tranche as TrancheType } from "../../lib/vega-web3/vega-web3-types";
import { Redirect } from "react-router-dom";
import { TrancheDates } from "./tranche-dates";
import { useTranslation } from "react-i18next";
import { BulletHeader } from "./bullet-header";
import { ProgressBar } from "./progress-bar";
import { Colors } from "../../colors";

export const Tranche = ({ tranches }: { tranches: TrancheType[] }) => {
  const { t } = useTranslation();
  const { trancheId } = useParams<{ trancheId: string }>();
  const tranche = React.useMemo(() => {
    return tranches.find(
      (tranche) => parseInt(tranche.tranche_id) === parseInt(trancheId)
    );
  }, [trancheId, tranches]);

  const getAbbreviatedNumber = (num: number) => {
    return Number(num.toFixed()).toLocaleString();
  };

  if (tranches.length === 0) {
    return <Loading />;
  }

  if (!tranche) {
    return <Redirect to="/not-found" />;
  }

  if (tranches.length > 0) {
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
      <>
        <BulletHeader tag="h2">
          {t("Tranche")} #{trancheId}
        </BulletHeader>
        <div style={{ marginTop: 20 }}>
          <TrancheDates
            start={tranche.tranche_start}
            end={tranche.tranche_end}
          />
        </div>
        <div>
          <h3 className="tranche__progress-title">{t("Locked")}</h3>
          <div className="tranche__progress-info">
            <ProgressBar
              percentage={locked_percentage}
              width={300}
              color={Colors.PINK}
            />
            <span>
              {getAbbreviatedNumber(tranche.locked_amount)} of (
              {getAbbreviatedNumber(tranche.total_added)})
            </span>
          </div>
        </div>
        <div>
          <h3 className="tranche__progress-title">{t("Redeemed")}</h3>
          <div className="tranche__progress-info">
            <ProgressBar
              percentage={removed_percentage}
              width={300}
              color={Colors.PINK}
            />
            <span>
              {getAbbreviatedNumber(tranche.total_removed)} of (
              {getAbbreviatedNumber(tranche.total_added)})
            </span>
          </div>
        </div>
        <BulletHeader tag="h2">Users</BulletHeader>
        <ul className="tranche__user-list">
          {tranche.users.map((user, i) => {
            return (
              <li className="tranche__user-item" key={i}>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={"https://etherscan.io/address/" + user.address}
                >
                  {user.address}
                </a>
                <div className="tranche__user-info">
                  <span>{user.total_tokens.toLocaleString()} VEGA</span>
                  <span>
                    {getAbbreviatedNumber(user.withdrawn_tokens)}{" "}
                    {t("Redeemed")}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </>
    );
  } else {
    return (
      <div
        style={{
          margin: "0 auto",
          marginTop: 160 + "px",
          textAlign: "center",
        }}
      >
        <Loading />
      </div>
    );
  }
};
