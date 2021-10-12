import "./eth-wallet-connect.scss";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";

export const EthWalletConnect = () => {
  const { t } = useTranslation();
  const {
    appState: { ethWalletConnecting },
  } = useAppState();

  if (ethWalletConnecting) {
    return <div>{t("Awaiting action in wallet...")}</div>;
  }

  return (
    <div className="eth-wallet-connect">
      <div>
        <button
          type="button"
          onClick={() => console.log("TODO: Remove this comonent not used")}
          data-testid="connect-overlay"
          className="eth-wallet-connect__button"
        >
          {t("Connect with Metamask")}
        </button>
      </div>
    </div>
  );
};
