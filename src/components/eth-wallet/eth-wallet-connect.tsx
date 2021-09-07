import "./eth-wallet-connect.scss";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useEthUser } from "../../hooks/use-eth-user";

export const EthWalletConnect = () => {
  const { t } = useTranslation();
  const {
    appState: { ethWalletConnecting },
  } = useAppState();
  const { connect } = useEthUser();

  if (ethWalletConnecting) {
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
