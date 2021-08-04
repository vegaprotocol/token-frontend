import { EthereumChainId } from "../../lib/web3-utils";
import { TransactionState, TxStatus } from "../../hooks/transaction-reducer";
import { Callout } from "../callout";
import { TransactionError } from "./transaction-error";
import { TransactionPending } from "./transaction-pending";
import { TransactionRequested } from "./transaction-requested";
import { TransactionComplete } from "./transaction-complete";
import { ArrowTopRight } from "../icons";

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

  if (state.txState === TxStatus.Error) {
    child = (
      <TransactionError
        onActionClick={reset}
        error={state.txData.userFacingError || state.txData.error}
        hash={state.txData.hash}
        chainId={chainId}
      />
    );
  } else if (state.txState === TxStatus.Pending) {
    child = <TransactionPending hash={state.txData.hash!} chainId={chainId} />;
  } else if (state.txState === TxStatus.Requested) {
    child = <TransactionRequested />;
  } else if (state.txState === TxStatus.Complete || complete) {
    child = (
      <TransactionComplete
        hash={state.txData.hash!}
        chainId={chainId}
        showLink={!complete}
      />
    );
  }

  return <Callout icon={<ArrowTopRight />}>{child}</Callout>;
};
