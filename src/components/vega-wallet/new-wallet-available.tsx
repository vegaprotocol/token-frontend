import "./new-wallet-available.scss";

import React from "react";
import { useTranslation } from "react-i18next";

import { vegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";

export const NewWalletAvailable = () => {
  const { t } = useTranslation();
  const [newVersionAvailable, setNewVersionAvailable] =
    React.useState<string | null>(null);
  const [latestVersionLocation, setLatestVersionLocation] =
    React.useState<string>();

  React.useEffect(() => {
    const getWalletLatest = async () => {
      const [latestVersion, location] =
        await vegaWalletService.getLastestVersion();
      const [, currentVersion] = await vegaWalletService.getVersion();
      if (latestVersion !== currentVersion) {
        setNewVersionAvailable(latestVersion);
        setLatestVersionLocation(location);
      }
    };

    getWalletLatest();
  }, []);

  if (!newVersionAvailable) {
    return null;
  }

  return (
    <div className="new-wallet-available__container">
      <span>{t("newWalletVersionAvailable")}</span>
      <a href={latestVersionLocation} target="_blank" rel="noreferrer">
        {t("downloadNewWallet", { newVersionAvailable })}
      </a>
    </div>
  );
};
