import "./eth-wallet.scss";
import { useTranslation } from "react-i18next";
import {
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { truncateMiddle } from "../../lib/truncate-middle";

export const EthWallet = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();

  let content = null;

  if (appState.providerStatus === ProviderStatus.Pending) {
    content = <div>Checking for provider</div>;
  } else if (appState.providerStatus === ProviderStatus.None) {
    content = <div>{t("invalidWeb3Browser")}</div>;
  } else {
    content = <ConnectedKey />;
  }

  return (
    <div className="eth-wallet">
      <div className="vega-wallet__key" title="Click to change key">
        <span style={{ textTransform: "uppercase" }}>Ethereum key</span>
        {appState.address && (
          <>
            <span className="vega-wallet__curr-key">
              {truncateMiddle(appState.address)}
            </span>
          </>
        )}
      </div>
      {content}
    </div>
  );
};

const ConnectedKey = () => {
  const { t } = useTranslation();
  const connect = useConnect();
  const { appState } = useAppState();
  const { connecting, address, error, balanceFormatted } = appState;

  if (error) {
    return <div>{t("Something went wrong")}</div>;
  }

  if (connecting) {
    return <div>{t("Awaiting action in wallet...")}</div>;
  }

  if (!address) {
    return (
      <button type="button" onClick={connect} className="eth-wallet__connect">
        {t("Connect")}
      </button>
    );
  }

  return (
    <>
      <div className="eth-wallet__row">
        <span>{t("Locked")}</span>
        <span>
          {balanceFormatted} {t("VEGA")}
        </span>
      </div>
      <div className="eth-wallet__row">
        <span>{t("Unlocked")}</span>
        <span>
          {/* TODO: get this valie */}
          0.00
        </span>
      </div>
    </>
  );
};
