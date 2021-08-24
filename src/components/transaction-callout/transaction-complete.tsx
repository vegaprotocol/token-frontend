import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/web3-utils";
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
      <p>{heading || t("Complete")}</p>
      {body && <p>{body}</p>}
      <p>
        <EtherscanLink hash={hash} chainId={chainId} />
      </p>
      {footer && <p>{footer}</p>}
    </Callout>
  );
};
