import { EthereumChainId } from "../../lib/vega-web3-utils";
import {
  TransactionState,
  TxState,
} from "../../routes/claim/transaction-reducer";
import { TransactionComplete } from "../transaction-complete";
import { TransactionConfirm } from "../transaction-confirm";
import { TransactionError } from "../transaction-error";
import { TransactionsInProgress } from "../transaction-in-progress";

export const TransactionCallout = ({
  state,
  reset,
  chainId,
  complete,
}: {
  state: TransactionState;
  reset: () => void;
  chainId: EthereumChainId;
  complete: boolean;
}) => {
  if (state.txState === TxState.Error) {
    return (
      <TransactionError
        onActionClick={reset}
        error={state.txData.error}
        hash={state.txData.hash}
        chainId={chainId}
      />
    );
  } else if (state.txState === TxState.Pending) {
    return (
      <TransactionsInProgress hash={state.txData.hash!} chainId={chainId} />
    );
  } else if (state.txState === TxState.Requested) {
    return <TransactionConfirm />;
  } else if (state.txState === TxState.Complete || complete) {
    return (
      <TransactionComplete
        hash={state.txData.hash!}
        chainId={chainId}
        showLink={!complete}
      />
    );
  }
  return null;
};
