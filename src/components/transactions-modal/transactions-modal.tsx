import "./transactions-modal.scss";

import { Overlay } from "@blueprintjs/core";
import { TxData } from "@vegaprotocol/smart-contracts-sdk";
import { EtherscanLink } from "@vegaprotocol/ui-toolkit";
import { useWeb3React } from "@web3-react/core";
import React from "react";

import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useContracts } from "../../contexts/contracts/contracts-context";
import { truncateMiddle } from "../../lib/truncate-middle";
import { Modal } from "../modal";

export const TransactionModal = () => {
  const { chainId } = useWeb3React();
  const { transactions } = useContracts();
  const { appState, appDispatch } = useAppState();

  const close = React.useCallback(
    () =>
      appDispatch({
        type: AppStateActionType.SET_TRANSACTION_OVERLAY,
        isOpen: false,
      }),
    [appDispatch]
  );

  const renderStatus = (t: TxData) => {
    if (!t.receipt) {
      return "Pending";
    }

    if (t.receipt.confirmations > t.requiredConfirmations) {
      return "Confirmed";
    }

    return `${t.receipt.confirmations} of ${t.requiredConfirmations} blocks to go`;
  };

  return (
    <Overlay
      className="bp3-dark"
      isOpen={appState.transactionOverlay}
      onClose={close}
      transitionDuration={0}
    >
      <div className="modal transactions-modal">
        <Modal>
          <h2>Ethereum Transactions</h2>
          {transactions.map((t) => {
            return (
              <div>
                <table className="transactions-modal__table">
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <EtherscanLink
                          tx={t.tx.hash}
                          text={truncateMiddle(t.tx.hash)}
                          chainId={`0x${chainId}` as any}
                        />
                      </td>
                      <td>{renderStatus(t)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </Modal>
      </div>
    </Overlay>
  );
};
