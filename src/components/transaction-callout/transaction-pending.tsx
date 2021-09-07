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
}: {
  hash: string;
  chainId: EthereumChainId;
  heading?: React.ReactElement | string;
  footer?: React.ReactElement | string;
  body?: React.ReactElement | string;
}) => {
  const { t } = useTranslation();
  return (
    <Callout icon={<Loader />}>
      <p data-testid="transaction-pending-heading">
        {heading || t("Transaction in progress")}
      </p>
      {body && <p data-testid="transaction-pending-body">{body}</p>}
      <p>
        <EtherscanLink tx={hash} chainId={chainId} />
      </p>
      {footer && <p data-testid="transaction-pending-footer">{footer}</p>}
    </Callout>
  );
};
