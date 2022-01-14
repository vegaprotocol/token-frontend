import "./transactions-modal.scss";

import { Overlay } from "@blueprintjs/core";
import { TxData } from "@vegaprotocol/smart-contracts-sdk";
import { EtherscanLink } from "@vegaprotocol/ui-toolkit";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useTranslation } from "react-i18next";

import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useContracts } from "../../contexts/contracts/contracts-context";
import { truncateMiddle } from "../../lib/truncate-middle";
import { Tick } from "../icons";
import { Loader } from "../loader";
import { Modal } from "../modal";

export const TransactionModal = () => {
  const { t } = useTranslation();
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

  const renderStatus = (txObj: TxData) => {
    const className = "transaction-modal__status";

    if (!txObj.receipt) {
      return (
        <span className={className}>
          <Loader invert={true} />
          {t("pending")}
        </span>
      );
    }

    if (txObj.receipt.confirmations >= txObj.requiredConfirmations) {
      return (
        <span className={className}>
          <Tick />
          {t("confirmed")}
        </span>
      );
    }

    return (
      <span className={className}>
        <Loader invert={true} />
        {t("confirmationsRemaining", {
          confirmations: txObj.receipt.confirmations,
          required: txObj.requiredConfirmations,
        })}
      </span>
    );
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
          <h2>{t("ethTransactionModalTitle")}</h2>
          {transactions.length ? (
            <table className="transactions-modal__table">
              <thead>
                <tr>
                  <th>{t("transaction")}</th>
                  <th>{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  return (
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
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No transactions</p>
          )}
        </Modal>
      </div>
    </Overlay>
  );
};
