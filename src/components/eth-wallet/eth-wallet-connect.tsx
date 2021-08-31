import "./eth-wallet-connect.scss";
import { useTranslation } from "react-i18next";
import { useConnect } from "../../hooks/use-connect";
import {
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";

export const EthWalletConnect = () => {
  const { t } = useTranslation();
  const {
    appState: { providerStatus, connecting },
  } = useAppState();
  const connect = useConnect();

  if (providerStatus === ProviderStatus.Pending) {
    return null;
  }

  if (providerStatus === ProviderStatus.None) {
    return <p>{t("invalidWeb3Browser")}</p>;
  }

  if (connecting) {
    return <div>{t("Awaiting action in wallet...")}</div>;
  }

  return (
    <div className="eth-wallet-connect">
      <div>
        <button
          type="button"
          onClick={connect}
          data-testid="connect-overlay"
          className="eth-wallet-connect__button"
        >
          {t("Connect with Metamask")}
        </button>
      </div>
    </div>
  );
};
