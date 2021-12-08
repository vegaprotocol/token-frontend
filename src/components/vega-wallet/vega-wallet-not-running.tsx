import { useTranslation } from "react-i18next";
import { DEFAULT_WALLET_URL } from "../../lib/vega-wallet/vega-wallet-service";
import "./vega-wallet-not-running.scss";

export const VegaWalletNotRunning = () => {
  const { t } = useTranslation();
  return (
    <div className="vega-wallet-not-running__container">
      <div className="vega-wallet-not-running__input">
        <p>{t("urlLabel")}</p>
        <input
          disabled={true}
          type="text"
          className="bp3-input"
          value={DEFAULT_WALLET_URL}
        />
      </div>
      <div className="vega-wallet-not-running__text-container">
        <div className="vega-wallet-not-running__exclamation">!</div>
        <div className="vega-wallet-not-running__text">
          <p>{t("noWalletDetected", { url: DEFAULT_WALLET_URL })}</p>
          <p>{t("noWalletHelpText")}</p>
          <p>{t("walletServiceNotRunning")}</p>
        </div>
      </div>
    </div>
  );
};
