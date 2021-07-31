import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/vega-web3-utils";
import { EtherscanLink } from "../etherscan-link";
import "./transaction-complete.scss";

export const TransactionComplete = ({
  hash,
  chainId,
}: {
  hash: string;
  chainId: EthereumChainId;
}) => {
  const { t } = useTranslation();
  return (
    <div className="transaction-complete">
      {t("Complete")}
      <div>
        <EtherscanLink hash={hash} chainId={chainId} />
      </div>
    </div>
  );
};
