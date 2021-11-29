import "./vote-progress.scss";

import React from "react";

export const VoteProgress = ({
  progress,
  threshold,
}: {
  threshold: number;
  progress: number;
}) => {
  return (
    <>
      <div
        data-testid="vote-progress-indicator"
        className="vote-progress__indicator"
        style={{ left: `${threshold}%` }}
      ></div>
      <div className="bp3-progress-bar bp3-no-stripes vote-progress__container">
        <div
          className="bp3-progress-meter vote-progress__bar"
          data-testid="vote-progress-bar"
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>
    </>
  );
};
