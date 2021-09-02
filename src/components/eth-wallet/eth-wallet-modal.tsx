import { Overlay } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { Modal } from "../modal";
import { EthWalletConnect } from "./eth-wallet-connect";

export const EthWalletModal = () => {
  const { t } = useTranslation();
  const { appState, appDispatch } = useAppState();
  return (
    <Overlay
      isOpen={appState.ethWalletOverlay}
      onClose={() =>
        appDispatch({
          type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
          isOpen: false,
        })
      }
      transitionDuration={0}
    >
      <div className="modal">
        <Modal>
          <h2>{t("Connect to an Ethereum wallet")}</h2>
          <EthWalletConnect />
        </Modal>
      </div>
    </Overlay>
  );
};
