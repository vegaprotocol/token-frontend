import React from "react";
import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../config";
import { Callout } from "../callout";
import { EtherscanLink } from "../etherscan-link";
import { Loader } from "../loader";

export const TransactionPending = ({
  hash,
  chainId,
  heading,
  footer,
  body,
  confirmations,
  requiredConfirmations,
}: {
  hash: string;
  chainId: EthereumChainId;
  confirmations: number | null;
  requiredConfirmations: number | null;
  heading?: React.ReactElement | string;
  footer?: React.ReactElement | string;
  body?: React.ReactElement | string;
}) => {
  const { t } = useTranslation();
  const remainingConfirmations = React.useMemo(() => {
    if (requiredConfirmations) {
      return Math.max(0, requiredConfirmations - (confirmations || 0));
    }
    return 0;
  }, [confirmations, requiredConfirmations]);
  const title = React.useMemo(() => {
    const defaultTitle = heading || t("Transaction in progress");
    if (requiredConfirmations) {
      return `${defaultTitle}. ${t("blockCountdown", {
        amount: remainingConfirmations,
      })}`;
    }
    return defaultTitle;
  }, [heading, remainingConfirmations, requiredConfirmations, t]);
  return (
    <Callout icon={<Loader />} title={title}>
      {body && <p data-testid="transaction-pending-body">{body}</p>}
      <p>
        <EtherscanLink tx={hash} chainId={chainId} />
      </p>
      {footer && <p data-testid="transaction-pending-footer">{footer}</p>}
    </Callout>
  );
};
