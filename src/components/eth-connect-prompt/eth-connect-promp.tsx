import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";

interface EthConnectPrompProps {
  children?: React.ReactNode;
}

export const EthConnectPrompt = ({ children }: EthConnectPrompProps) => {
  const { appDispatch } = useAppState();
  const { t } = useTranslation();
  return (
    <>
      {children}
      <button
        onClick={() =>
          appDispatch({
            type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
            isOpen: true,
          })
        }
      >
        {t("Connect to an Ethereum wallet")}
      </button>
    </>
  );
};
