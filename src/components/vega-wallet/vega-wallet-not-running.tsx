import { useTranslation } from "react-i18next";
import "./vega-wallet-not-running.scss";

export const VegaWalletNotRunning = () => {
  const { t } = useTranslation();
  return (
    <div className="vega-wallet-not-running__container">
      <div className="vega-wallet-not-running__input">
        <p>{t("urlLabel")}</p>
        <input disabled={true} type="text" className="bp3-input" />
      </div>
      <div className="vega-wallet-not-running__text-container">
        <div className="vega-wallet-not-running__exclamation">!</div>
        <div className="vega-wallet-not-running__text">
          <p>{t("noWalletDetected")}</p>
          <p>{t("noWalletHelpText")}</p>
          <p>{t("walletServiceNotRunning")}</p>
        </div>
      </div>
    </div>
  );
};
