import React from "react";
import { useParams } from "react-router";
import { Loading } from "../../components/loading";
import tranches from "./tranchData.json";
import moment from "moment";

export const Tranche = () => {
  const { trancheId } = useParams() as any;
  console.log(trancheId);
  const getTranche = () => {
    const matches = tranches.filter(
      (tranche) => parseInt(tranche.tranche_id) === parseInt(trancheId)
    );
    if (matches.length === 0) return null;
    return matches[0];
  };
  const getTrancheDates = (tranche_start: string, tranche_end: string) => {
    if (new Date(tranche_start).getTime() === new Date(tranche_end).getTime()) {
      return (
        <span>
          Fully vested on{" "}
          {moment(new Date(tranche_start).getTime()).format("MMM D, YYYY")}
        </span>
      );
    }
    return (
      <span>
        Vesting from{" "}
        {moment(new Date(tranche_start).getTime()).format("MMM D, YYYY")} to{" "}
        {moment(new Date(tranche_end).getTime()).format("MMM D, YYYY")}
      </span>
    );
  };
  const getAbbreviatedNumber = (num: number) => {
    return Number(num.toFixed()).toLocaleString();
  };
  //   const withdraw = async () => {
  //     console.log("noop");
  //   };
  const currentTranche = getTranche();
  if (!currentTranche || tranches.length > 0) {
    return <div className="Inner">Invalid tranche!</div>;
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
              {/* <div
                className="GoBack"
                // onClick={() => (window.top.location = "/")} // TODO add router link
              >
                <img alt="Go back" src={back} height={12} /> Back
              </div> */}
              <div className="TrancheTitle">Tranche #{trancheId}</div>
              <div className="TrancheDates">
                {getTrancheDates(
                  currentTranche.tranche_start,
                  currentTranche.tranche_end
                )}
              </div>
            </div>
            {/* <div className="Right">
              {props.connected && !processing && !withdrawSuccessful ? (
                <div className="WhiteButton" onClick={() => withdraw()}>
                  Withdraw
                </div>
              ) : null}
              {processing ? (
                <ClipLoader color="#FFFFFF" loading={processing} size={25} />
              ) : null}
              {withdrawSuccessful ? (
                <div className="WithdrawSuccess">
                  VEGA was successfully withdrawn to your wallet
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
              <span className="SquareText">Locked</span>
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
              <span className="SquareText">Redeemed</span>
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
                of ({getAbbreviatedNumber(currentTranche.total_added)})
              </span>
            </div>
            <div className="Clear"></div>
          </div>
          <div className="TrancheUsers">
            <div className="TrancheUsersHeader">Users</div>
            {currentTranche.users.map((user) => {
              return (
                <div className="TrancheUserRow">
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
                      {getAbbreviatedNumber(user.withdrawn_tokens)} redeemed
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
