import { EthereumChainId } from "../../lib/web3-utils";
import { TransactionState, TxState } from "../../hooks/transaction-reducer";
import { TransactionError } from "./transaction-error";
import { TransactionPending } from "./transaction-pending";
import { TransactionRequested } from "./transaction-requested";
import { TransactionComplete } from "./transaction-complete";

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
        error={state.txData.userFacingError || state.txData.error}
        hash={state.txData.hash}
        chainId={chainId}
      />
    );
  } else if (state.txState === TxState.Pending) {
    return <TransactionPending hash={state.txData.hash!} chainId={chainId} />;
  } else if (state.txState === TxState.Requested) {
    return <TransactionRequested />;
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
