import "./transaction-button.scss";
import { TransactionState, TxState } from "../../hooks/transaction-reducer";
import { Loader } from "../loader";
import { Error, HandUp, Tick } from "../icons";
import { truncateMiddle } from "../../lib/truncate-middle";
import { StatefulButton } from "../stateful-button";

interface TransactionButtonProps {
  transactionState: TransactionState;
  /** txHash from the withdrawal object, indicating whether withdrawal has been completed or not */
  forceTxState?: TxState;
  disabled?: boolean;
  start: () => void;
  reset: () => void;
}

export const TransactionButton = ({
  transactionState,
  forceTxState,
  disabled = false,
  start,
  reset,
}: TransactionButtonProps) => {
  const { txState, txData } = transactionState;
  const wrapperProps = {
    className: `transaction-button transaction-button--${txState.toLowerCase()}`,
  };
  const buttonProps = {
    className: "transaction-button__button fill",
  };
  const txhashProps = {
    className: "transaction-button__txhash",
  };
  const textProps = {
    className: "transaction-button__text",
  };

  const etherscanLink = txData.hash && (
    <a
      href={`https://ropsten.etherscan.io/tx/${txData.hash}`}
      target="_blank"
      rel="noreferrer"
    >
      {truncateMiddle(txData.hash)}
    </a>
  );

  if (forceTxState === TxState.Complete || txState === TxState.Complete) {
    // If the withdrawal has already been completed the txState will be Default as the
    // transaction ahasn'twwwwwwfhjyi7Aggfgfg
    const props = {
      ...wrapperProps,
      className: `transaction-button transaction-button--${TxState.Complete.toLowerCase()}`,
    };
    return (
      <div {...props}>
        <p {...textProps}>
          <Tick />
          <span>Complete</span>
        </p>
        <p {...txhashProps}>
          <span>Transaction</span>
          {etherscanLink}
        </p>
      </div>
    );
  }

  // User as started transaction and we are awaiting confirmation from the users wallet
  if (txState === TxState.Requested) {
    return (
      <div {...wrapperProps}>
        <StatefulButton {...buttonProps} disabled={true}>
          <HandUp />
          <span>Action required in Ethereum wallet</span>
        </StatefulButton>
      </div>
    );
  }

  if (txState === TxState.Pending) {
    return (
      <div {...wrapperProps}>
        <StatefulButton {...buttonProps} disabled={true}>
          <Loader />
          <span>Awaiting Ethereum transaction</span>
        </StatefulButton>
        <p {...txhashProps}>
          <span>Transaction</span>
          {etherscanLink}
        </p>
      </div>
    );
  }

  if (txState === TxState.Error) {
    return (
      <div {...wrapperProps}>
        <p {...textProps}>
          <Error />
          <span>Ethereum transaction failed</span>
          <button onClick={reset} type="button" className="button-link">
            Try again
          </button>
        </p>
        <p {...txhashProps}>
          <span>Transaction</span>
          {etherscanLink}
        </p>
      </div>
    );
  }

  // Idle
  return (
    <div {...wrapperProps}>
      <StatefulButton {...buttonProps} onClick={start} disabled={disabled}>
        Complete
      </StatefulButton>
    </div>
  );
};
