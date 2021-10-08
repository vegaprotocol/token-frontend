import { TransactionState, TxState } from "../../hooks/transaction-reducer";
import { TransactionError } from "./transaction-error";
import { TransactionPending } from "./transaction-pending";
import { TransactionRequested } from "./transaction-requested";
import { TransactionComplete } from "./transaction-complete";
import { useWeb3 } from "../../contexts/web3/web3-context";

export const TransactionCallout = ({
  state,
  reset,
  completeHeading,
  completeBody,
  completeFooter,
  pendingHeading,
  pendingFooter,
  pendingBody,
}: {
  state: TransactionState;
  reset: () => void;
  completeHeading?: React.ReactElement | string;
  completeBody?: React.ReactElement | string;
  completeFooter?: React.ReactElement | string;
  pendingHeading?: React.ReactElement | string;
  pendingBody?: React.ReactElement | string;
  pendingFooter?: React.ReactElement | string;
}) => {
  const { chainId } = useWeb3();
  // TODO use switch to kill dead code branches
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
    return (
      <TransactionPending
        confirmations={state.txData.confirmations}
        requiredConfirmations={state.requiredConfirmations}
        hash={state.txData.hash!}
        chainId={chainId!}
        heading={pendingHeading}
        body={pendingBody}
        footer={pendingFooter}
      />
    );
  } else if (state.txState === TxState.Requested) {
    return <TransactionRequested />;
  } else if (state.txState === TxState.Complete) {
    return (
      <TransactionComplete
        hash={state.txData.hash!}
        chainId={chainId!}
        heading={completeHeading}
        body={completeBody}
        footer={completeFooter}
      />
    );
  }
  return null;
};
