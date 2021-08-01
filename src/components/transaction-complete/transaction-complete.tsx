import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/web3-utils";
import { EtherscanLink } from "../etherscan-link";
import "./transaction-complete.scss";

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
    <div className="transaction-complete">
      {t("Complete")}
      {showLink && (
        <div>
          <EtherscanLink hash={hash} chainId={chainId} />
        </div>
      )}
    </div>
  );
};
