import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/web3-utils";
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
      <p>{heading || t("Transaction in progress")}</p>
      {body && <p>{body}</p>}
      <p>
        <EtherscanLink hash={hash} chainId={chainId} />
      </p>
      {footer && <p>{footer}</p>}
    </Callout>
  );
};
