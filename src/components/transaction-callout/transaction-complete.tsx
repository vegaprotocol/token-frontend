import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/web3-utils";
import { Callout } from "../callout";
import { EtherscanLink } from "../etherscan-link";
import { Tick } from "../icons";

export const TransactionComplete = ({
  hash,
  chainId,
  showLink = true,
}: {
  hash: string;
  chainId: EthereumChainId;
  showLink?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <Callout icon={<Tick />} intent="success">
      <p>{t("Complete")}</p>
      {showLink && (
        <p>
          <EtherscanLink hash={hash} chainId={chainId} />
        </p>
      )}
    </Callout>
  );
};
