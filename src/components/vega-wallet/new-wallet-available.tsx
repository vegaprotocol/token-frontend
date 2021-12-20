import React from "react";
import "./new-wallet-available.scss";

import { useTranslation } from "react-i18next";
import { vegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";

export const NewWalletAvailable = () => {
  const { t } = useTranslation();

  React.useEffect(() => {
    const getWalletLatest = async () => {
      const {name} = await vegaWalletService.getLastestVersion();
      const [, currentVersion] = await vegaWalletService.getVersion();
      console.log(333, name, currentVersion);
    };

    getWalletLatest();
  }, []);

  return (
    <div className="new-wallet-available__container">
      <span>{t("newWalletVersionAvailable")}</span>
      <span>{t("downloadNewWallet")}</span>
    </div>
  );
};
