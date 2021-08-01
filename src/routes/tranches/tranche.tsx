import React from "react";
import { useParams } from "react-router";
import { Loading } from "../../components/loading";
import type { Tranche as TrancheType } from "../../lib/vega-web3/vega-web3-types";
import { Link } from "react-router-dom";
import { TrancheDates } from "./tranche-dates";
import { useTranslation } from "react-i18next";

export const Tranche = ({ tranches }: { tranches: TrancheType[] }) => {
  const { t } = useTranslation();

  const { trancheId } = useParams<{ trancheId: string }>();

  const getTranche = () => {
    const matches = tranches.filter(
      (tranche) => parseInt(tranche.tranche_id) === parseInt(trancheId)
    );
    if (matches.length === 0) return null;
    return matches[0];
  };

  const getAbbreviatedNumber = (num: number) => {
    return Number(num.toFixed()).toLocaleString();
  };
  //   const withdraw = async () => {
  //     console.log("noop");
  //   };

  const currentTranche = getTranche();

  if (tranches.length === 0) {
    return <Loading />;
  } else if (!currentTranche) {
    return <div className="Inner">{t("Invalid tranche!")}</div>;
  } else if (tranches.length > 0) {
    let locked_percentage = Math.round(
      (currentTranche.locked_amount / currentTranche.total_added) * 100
    );
    let removed_percentage = Math.round(
      (currentTranche.total_removed / currentTranche.total_added) * 100
    );
    if (currentTranche.total_added === 0) {
      locked_percentage = 0;
      removed_percentage = 0;
    }
    return (
      <div className="Inner">
        <div className="TrancheDetails">
          <div>
            <div className="Left">
              <Link to="/tranches" className="GoBack">
                &lt; {t("Back")}
              </Link>
              <div className="TrancheTitle">
                {t("Tranche")} #{trancheId}
              </div>
              <div className="TrancheDates">
                <TrancheDates
                  start={currentTranche.tranche_start}
                  end={currentTranche.tranche_end}
                />
              </div>
            </div>
            {/* <div className="Right">
              {props.connected && !processing && !withdrawSuccessful ? (
                <div className="WhiteButton" onClick={() => withdraw()}>
                  {t("Withdraw")}
                </div>
              ) : null}
              {processing ? (
                <ClipLoader color="#FFFFFF" loading={processing} size={25} />
              ) : null}
              {withdrawSuccessful ? (
                <div className="WithdrawSuccess">
                  {t("VEGA was successfully withdrawn to your wallet")}
                </div>
              ) : null}
              {withdrawError ? (
                <div className="WithdrawError">{withdrawError}</div>
              ) : null}
            </div> */}
            <div className="Clear"></div>
          </div>
          <div className="ProgressBarsHolder">
            <div className="Left">
              <span className="Square"></span>
              <span className="SquareText">{t("Locked")}</span>
              <div className="ProgressRow">
                <span className="ProgressBarHolder">
                  <div className="ProgressBar">
                    <div
                      style={{ width: locked_percentage + "%" }}
                      className="ProgressIndicatorPink"
                    ></div>
                  </div>
                </span>
              </div>
              <span className="ProgressAmount">
                {getAbbreviatedNumber(currentTranche.locked_amount)}
              </span>
              <span className="ProgressAmountSmall">
                {" "}
                of ({getAbbreviatedNumber(currentTranche.total_added)})
              </span>
            </div>
            <div className="Right">
              <span className="Square"></span>
              <span className="SquareText">{t("Redeemed")}</span>
              <div className="ProgressRow">
                <span className="ProgressBarHolder">
                  <div className="ProgressBar">
                    <div
                      style={{ width: removed_percentage + "%" }}
                      className="ProgressIndicatorGreen"
                    ></div>
                  </div>
                </span>
              </div>
              <span className="ProgressAmount">
                {getAbbreviatedNumber(currentTranche.total_removed)}
              </span>
              <span className="ProgressAmountSmall">
                {" "}
                {t("of")} ({getAbbreviatedNumber(currentTranche.total_added)})
              </span>
            </div>
            <div className="Clear"></div>
          </div>
          <div className="TrancheUsers">
            <div className="TrancheUsersHeader">Users</div>
            {currentTranche.users.map((user, i) => {
              return (
                <div className="TrancheUserRow" key={i}>
                  <div className="Left UserAddress">
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={"https://etherscan.io/address/" + user.address}
                    >
                      {user.address}
                    </a>
                  </div>
                  <div className="Right">
                    {user.total_tokens.toLocaleString()} VEGA{" "}
                    <span className="UserRedeemed">
                      {getAbbreviatedNumber(user.withdrawn_tokens)}{" "}
                      {t("Redeemed").toLowerCase()}
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
