import { EthereumChainId } from "../../lib/web3-utils";
import { TransactionState, TxState } from "../../hooks/transaction-reducer";
import { TransactionError } from "./transaction-error";
import { TransactionPending } from "./transaction-pending";
import { TransactionConfirm } from "./transaction-confirm";
import { TransactionComplete } from "./transaction-complete";
import { Callout } from "../callout";

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
  let child = null;

  if (state.txState === TxState.Error) {
    child = (
      <TransactionError
        onActionClick={reset}
        error={state.txData.userFacingError || state.txData.error}
        hash={state.txData.hash}
        chainId={chainId}
      />
    );
  } else if (state.txState === TxState.Pending) {
    child = <TransactionPending hash={state.txData.hash!} chainId={chainId} />;
  } else if (state.txState === TxState.Requested) {
    child = <TransactionConfirm />;
  } else if (state.txState === TxState.Complete || complete) {
    child = (
      <TransactionComplete
        hash={state.txData.hash!}
        chainId={chainId}
        showLink={!complete}
      />
    );
  }

  return <Callout>{child}</Callout>;
};
