import "./notice.scss";

import React from "react";

export const Notice = ({ vestingAddress }: { vestingAddress: string }) => {
  return (
    <div className="notice">
      <p>
        This web page reads directly from the vesting smart contract implemented
        by the Vega project team. The vesting smart is responsible for holding
        tokens whilst they are locked, and managing the distribution of tokens
        to their owners according to pre-defined vesting terms.
      </p>
      <p>
        The contract is deployed at the following address:{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={"https://etherscan.io/address/" + vestingAddress}
        >
          {vestingAddress}
        </a>
      </p>
    </div>
  );
};
