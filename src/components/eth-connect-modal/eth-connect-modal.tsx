import "./eth-connect-modal.scss";

import { Overlay } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useWeb3Connect } from "../../hooks/use-web3";
import { Connectors } from "../../lib/connectors";
import { Modal } from "../modal";

export const EthConnectModal = () => {
  const { t } = useTranslation();
  const { appState, appDispatch } = useAppState();
  const { connect } = useWeb3Connect();
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
          <h2>Connect Ethereum wallet</h2>
          <div>
            {Object.entries(Connectors).map(([key, connector]) => {
              if (key === "networkOnly") return null;
              return (
                <button
                  key={key}
                  className="eth-connect-modal__button button-link"
                  type="button"
                  onClick={() => {
                    connect(connector);
                    close();
                  }}
                >
                  <div>{t(`${key}.name`)}</div>
                  <div>{t(`${key}.text`)}</div>
                </button>
              );
            })}
          </div>
        </Modal>
      </div>
    </Overlay>
  );
};
