import "./notice.scss";
import { useTranslation } from "react-i18next";

import React from "react";

export const Notice = ({ vestingAddress }: { vestingAddress: string }) => {
  const { t } = useTranslation()
  return (
    <div className="notice">
      <p>
        {t("projectDescription")}
      </p>
      <p>
        {t("The contract is deployed at the following address")}
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
