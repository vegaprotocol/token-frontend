import "./notice.scss";
import { Trans } from "react-i18next";

import React from "react";

export const Notice = ({ vestingAddress }: { vestingAddress: string }) => {
  return (
    <div className="notice">
      <p>
        <Trans i18nKey="projectDescription">
          This web page reads...
        </Trans>
      </p>
      <p>
        <Trans>The contract is deployed at the following address</Trans>:{" "}
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
