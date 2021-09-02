import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";

export const EthConnectPrompt = () => {
  const { appDispatch } = useAppState();
  const { t } = useTranslation();
  return (
    <>
      <p>
        {t(
          "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas."
        )}
      </p>
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
