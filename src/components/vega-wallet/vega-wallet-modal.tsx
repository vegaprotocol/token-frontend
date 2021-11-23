import { Overlay } from "@blueprintjs/core";
import { Trans, useTranslation } from "react-i18next";
import { Links } from "../../config";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { Modal } from "../modal";
import { VegaWalletForm } from "./vega-wallet-form";

export const VegaWalletModal = () => {
  const { t } = useTranslation();
  const { appState, appDispatch } = useAppState();
  return (
    <Overlay
      className="bp3-dark"
      isOpen={appState.vegaWalletOverlay}
      onClose={() =>
        appDispatch({
          type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
          isOpen: false,
        })
      }
      transitionDuration={0}
    >
      <div className="modal modal--dark">
        <Modal>
          <h2>{t("connectVegaWallet")}</h2>
          <VegaWalletForm
            onConnect={() =>
              appDispatch({
                type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
                isOpen: false,
              })
            }
          />
          <h2>Don't have a Vega wallet yet?</h2>
          <p>
            <a href={Links.WALLET_GUIDE} target="_blank" rel="noreferrer">
              Read the wallet guide
            </a>
          </p>
          <p>
            <a href={Links.WALLET_RELEASES} target="_blank" rel="noreferrer">
              Download wallet from GitHub
            </a>
          </p>
        </Modal>
      </div>
    </Overlay>
  );
};
