import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../config";
import { Callout } from "../callout";
import { EtherscanLink } from "../etherscan-link";
import { Tick } from "../icons";

export const TransactionComplete = ({
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
    <Callout icon={<Tick />} intent="success">
      <p data-testid="transaction-complete-heading">
        {heading || t("Complete")}
      </p>
      {body && <p data-testid="transaction-complete-body">{body}</p>}
      <p>
        <EtherscanLink tx={hash} chainId={chainId} />
      </p>
      {footer && <p data-testid="transaction-complete-footer">{footer}</p>}
    </Callout>
  );
};
