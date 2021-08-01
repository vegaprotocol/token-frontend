import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/web3-utils";
import { EtherscanLink } from "../etherscan-link";
import "./transaction-in-progress.scss";

export const TransactionsInProgress = ({
  hash,
  chainId,
}: {
  hash: string;
  chainId: EthereumChainId;
}) => {
  const { t } = useTranslation();
  return (
    <div className="transaction-in-progress">
      {t("Transaction in progress")}
      <div>
        <EtherscanLink hash={hash} chainId={chainId} />
      </div>
    </div>
  );
};
