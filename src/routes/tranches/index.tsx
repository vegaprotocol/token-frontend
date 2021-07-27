import React from "react";
import { Loading } from "../../components/loading";
import moment from "moment";
import tranches from "./tranchData.json";

const TrancheRouter = () => {
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
    if (num < 1000) {
      return Number(num.toFixed()).toLocaleString();
    } else if (num < 1000000) {
      return Number((num / 1000).toFixed()).toLocaleString() + "K";
    } else if (num < 1000000000) {
      return Number((num / 1000000).toFixed()).toLocaleString() + "M";
    }
    return Number((num / 1000000000).toFixed()).toLocaleString() + "B";
  };
  if (tranches.length === 0) {
    return (
      <div
        style={{
          margin: "0 auto",
          marginTop: 40 + "px",
          marginBottom: 60 + "px",
          textAlign: "center",
        }}
      >
        <Loading />
      </div>
    );
  }
  return (
    <div className="App">
      <div className="Inner">
        <div style={{ paddingBottom: 60 + "px" }}>
          <div className="TableHeading">
            <span className="Square"></span>
            <span className="SquareText">Tranches</span>
          </div>
          {tranches.map((tranche, i) => {
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
              <div className="TableRow" key={i}>
                <div className="Left">
                  <span
                    className="TrancheLink"
                    // onClick={() => goToTranche(tranche.tranche_id)} TODO use router link here
                  >
                    <span className="TrancheTitle">Tranche</span>
                    <span className="TrancheID">#{tranche.tranche_id}</span>
                  </span>
                  <span className="TrancheDates">
                    {getTrancheDates(
                      tranche.tranche_start,
                      tranche.tranche_end
                    )}
                  </span>
                </div>
                <div className="Right">
                  <span className="ProgressTitle">Locked</span>
                  <span className="ProgressBarHolder">
                    <div className="ProgressBar">
                      <div
                        style={{ width: locked_percentage + "%" }}
                        className="ProgressIndicatorPink"
                      ></div>
                    </div>
                  </span>
                  <span className="ProgressNumbers">
                    ({getAbbreviatedNumber(tranche.locked_amount)} of{" "}
                    {getAbbreviatedNumber(tranche.total_added)})
                  </span>
                  <span className="ProgressTitle">Redeemed</span>
                  <span className="ProgressBarHolder">
                    <div className="ProgressBar">
                      <div
                        style={{ width: removed_percentage + "%" }}
                        className="ProgressIndicatorGreen"
                      ></div>
                    </div>
                  </span>
                  <span className="ProgressNumbers">
                    ({getAbbreviatedNumber(tranche.total_removed)} of{" "}
                    {getAbbreviatedNumber(tranche.total_added)})
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
};

export default TrancheRouter;
