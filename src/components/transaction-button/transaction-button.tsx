import "./transaction-button.scss";
import { TransactionState, TxState } from "../../hooks/transaction-reducer";
import { Loader } from "../loader";
import { Error, HandUp, Tick } from "../icons";
import { truncateMiddle } from "../../lib/truncate-middle";
import { StatefulButton } from "../stateful-button";
import { useTranslation } from "react-i18next";

interface TransactionButtonProps {
  transactionState: TransactionState;
  /** txHash from the withdrawal object, indicating whether withdrawal has been completed or not */
  forceTxHash: string | null;
  forceTxState?: TxState;
  disabled?: boolean;
  start: () => void;
  reset: () => void;
}

export const TransactionButton = ({
  transactionState,
  forceTxHash,
  forceTxState,
  disabled = false,
  start,
  reset,
}: TransactionButtonProps) => {
  const { t } = useTranslation();
  const { txState, txData } = transactionState;
  const root = "transaction-button";
  const wrapperClassName = `${root} transaction-button--${txState.toLowerCase()}`;
  const buttonClassName = `${root}__button fill`;
  const txhashClassName = `${root}__txhash`;
  const textClassName = `${root}__text`;

  const txHash = forceTxHash || txData.hash;
  const state = forceTxState || txState;

  const etherscanLink = txHash && (
    <a
      href={`https://ropsten.etherscan.io/tx/${txHash}`}
      target="_blank"
      rel="noreferrer"
    >
      {truncateMiddle(txHash)}
    </a>
  );

  if (state === TxState.Complete) {
    const className = `transaction-button transaction-button--${TxState.Complete.toLowerCase()}`;
    return (
      <div className={className}>
        <p className={textClassName}>
          <Tick />
          <span>{t("txButtonComplete")}</span>
        </p>
        <p className={txhashClassName}>
          <span>{t("transaction")}</span>
          {etherscanLink}
        </p>
      </div>
    );
  }

  // User as started transaction and we are awaiting confirmation from the users wallet
  if (state === TxState.Requested) {
    return (
      <div className={wrapperClassName}>
        <StatefulButton className={buttonClassName} disabled={true}>
          <HandUp />
          <span>{t("txButtonActionRequired")}</span>
        </StatefulButton>
      </div>
    );
  }

  if (state === TxState.Pending) {
    return (
      <div className={wrapperClassName}>
        <StatefulButton className={buttonClassName} disabled={true}>
          <Loader />
          <span>{t("txButtonAwaiting")}</span>
        </StatefulButton>
        <p className={txhashClassName}>
          <span>{t("transaction")}</span>
          {etherscanLink}
        </p>
      </div>
    );
  }

  if (state === TxState.Error) {
    return (
      <div className={wrapperClassName}>
        <p className={textClassName}>
          <Error />
          <span>{t("txButtonFailure")}</span>
          <button onClick={reset} type="button" className="button-link">
            {t("Try again")}
          </button>
        </p>
        <p className={txhashClassName}>
          <span>{t("transaction")}</span>
          {etherscanLink}
        </p>
      </div>
    );
  }

  // Idle
  return (
    <div className={wrapperClassName}>
      <StatefulButton
        className={buttonClassName}
        onClick={start}
        disabled={disabled}
      >
        {t("txButtonComplete")}
      </StatefulButton>
    </div>
  );
};
