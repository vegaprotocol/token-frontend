import { Overlay } from "@blueprintjs/core";

import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useWeb3 } from "../../hooks/use-web3";
import { injected, walletconnect } from "../../lib/connectors";
import { Modal } from "../modal";

export const EthConnectModal = () => {
  const { appState, appDispatch } = useAppState();
  const { activate } = useWeb3();
  const close = () =>
    appDispatch({
      type: AppStateActionType.SET_ETH_WALLET_OVERLAY,
      isOpen: false,
    });
  return (
    <Overlay
      className="bp3-dark"
      isOpen={appState.ethConnectOverlay}
      onClose={close}
      transitionDuration={0}
    >
      <div className="modal modal--dark">
        <Modal>
          <div>
            <button
              type="button"
              onClick={() => {
                activate(injected);
                close();
              }}
            >
              Injected
            </button>
            <button
              type="button"
              onClick={() => {
                activate(walletconnect);
                close();
              }}
            >
              Wallet Connect
            </button>
          </div>
        </Modal>
      </div>
    </Overlay>
  );
};
