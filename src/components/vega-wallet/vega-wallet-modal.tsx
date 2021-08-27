import { Overlay } from "@blueprintjs/core";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { Modal } from "../modal";
import { VegaWalletForm } from "./vega-wallet-form";

export const VegaWalletModal = () => {
  const { appState, appDispatch } = useAppState();
  return (
    <Overlay
      isOpen={appState.vegaWalletOverlay}
      onClose={() =>
        appDispatch({
          type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
          isOpen: false,
        })
      }
      transitionDuration={0}
    >
      <div className="modal">
        <Modal>
          <h2>Connect to Vega wallet</h2>
          <VegaWalletForm
            onConnect={() =>
              appDispatch({
                type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
                isOpen: false,
              })
            }
          />
        </Modal>
      </div>
    </Overlay>
  );
};
