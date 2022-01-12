import { Overlay } from "@blueprintjs/core";
import React from "react";

import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { Modal } from "../modal";

export const TransactionModal = () => {
  const { appState, appDispatch } = useAppState();

  const close = React.useCallback(
    () =>
      appDispatch({
        type: AppStateActionType.SET_TRANSACTION_OVERLAY,
        isOpen: false,
      }),
    [appDispatch]
  );

  return (
    <Overlay
      className="bp3-dark"
      isOpen={appState.transactionOverlay}
      onClose={close}
      transitionDuration={0}
    >
      <div className="modal modal--dark">
        <Modal>
          <h2>Transactions</h2>
          <div>
            {appState.ethTransactions.map((t) => {
              return <div>{t.tx.hash}</div>;
            })}
          </div>
        </Modal>
      </div>
    </Overlay>
  );
};
