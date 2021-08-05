import "./notice.scss";
import { useTranslation } from "react-i18next";
import React from "react";
import { Addresses } from "../../lib/web3-utils";
import { useAppState } from "../../contexts/app-state/app-state-context";

export const Notice = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const { vestingAddress } = React.useMemo(
    () => Addresses[appState.appChainId],
    [appState.appChainId]
  );
  return (
    <div className="notice">
      <p>{t("projectDescription")}</p>
      <p>
        {t("The contract is deployed at the following address")}{" "}
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
