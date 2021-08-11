import { TransactionState, TxState } from "../../hooks/transaction-reducer";
import { TransactionError } from "./transaction-error";
import { TransactionPending } from "./transaction-pending";
import { TransactionRequested } from "./transaction-requested";
import { TransactionComplete } from "./transaction-complete";
import { useAppState } from "../../contexts/app-state/app-state-context";

export const TransactionCallout = ({
  state,
  reset,
}: {
  state: TransactionState;
  reset: () => void;
}) => {
  const {
    appState: { chainId },
  } = useAppState();
  if (state.txState === TxState.Error) {
    return (
      <TransactionError
        onActionClick={reset}
        error={state.txData.userFacingError || state.txData.error}
        hash={state.txData.hash}
        chainId={chainId!}
      />
    );
  } else if (state.txState === TxState.Pending) {
    return <TransactionPending hash={state.txData.hash!} chainId={chainId!} />;
  } else if (state.txState === TxState.Requested) {
    return <TransactionRequested />;
  } else if (state.txState === TxState.Complete) {
    return <TransactionComplete hash={state.txData.hash!} chainId={chainId!} />;
  }
  return null;
};
