import "./new-wallet-available.scss";

import * as Sentry from "@sentry/react";
import React from "react";
import { useTranslation } from "react-i18next";

import { Links } from "../../config/links";
import { vegaWalletService } from "../../lib/vega-wallet/vega-wallet-service";

export const NewWalletAvailable = () => {
  const { t } = useTranslation();
  const [newVersionAvailable, setNewVersionAvailable] = React.useState<
    string | null
  >(null);
  const [latestVersionLocation, setLatestVersionLocation] =
    React.useState<string>();

  React.useEffect(() => {
    const getWalletLatest = async () => {
      try {
        const res = await fetch(Links.WALLET_RELEASES_HISTORY, {});
        const json = await res.json();

        // find the first non-prelease
        for (let walletVerison of json) {
          if (!walletVerison.prerelease) {
            const location = Links.WALLET_RELEASES_LATEST + walletVerison.name;
            const latestVersion = walletVerison.name;
            const [, currentVersion] = await vegaWalletService.getVersion();
            if (latestVersion !== currentVersion) {
              setNewVersionAvailable(latestVersion);
              setLatestVersionLocation(location);
            }
          }
        }
      } catch (err) {
        Sentry.captureException(err);
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
