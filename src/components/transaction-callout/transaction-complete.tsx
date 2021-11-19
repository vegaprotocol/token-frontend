import { useTranslation } from "react-i18next";
import { Callout } from "../callout";
import { EtherscanLink } from "../etherscan-link";
import { CopyToClipboardType } from "../etherscan-link/etherscan-link";
import { Tick } from "../icons";

export const TransactionComplete = ({
  hash,
  heading,
  footer,
  body,
}: {
  hash: string;
  heading?: React.ReactElement | string;
  footer?: React.ReactElement | string;
  body?: React.ReactElement | string;
}) => {
  const { t } = useTranslation();
  return (
    <Callout icon={<Tick />} intent="success" title={heading || t("Complete")}>
      {body && <p data-testid="transaction-complete-body">{body}</p>}
      <p>
        <EtherscanLink tx={hash} copyToClipboard={CopyToClipboardType.LINK} />
      </p>
      {footer && <p data-testid="transaction-complete-footer">{footer}</p>}
    </Callout>
  );
};
