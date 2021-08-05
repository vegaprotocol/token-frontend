import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/web3-utils";
import { Callout } from "../callout";
import { EtherscanLink } from "../etherscan-link";
import { Loader } from "../loader";

export const TransactionPending = ({
  hash,
  chainId,
}: {
  hash: string;
  chainId: EthereumChainId;
}) => {
  const { t } = useTranslation();
  return (
    <Callout icon={<Loader />}>
      <p>{t("Transaction in progress")}</p>
      <p>
        <EtherscanLink hash={hash} chainId={chainId} />
      </p>
    </Callout>
  );
};
