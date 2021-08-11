import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/web3-utils";
import { Callout } from "../callout";
import { EtherscanLink } from "../etherscan-link";
import { Tick } from "../icons";

export const TransactionComplete = ({
  hash,
  chainId,
}: {
  hash: string;
  chainId: EthereumChainId;
}) => {
  const { t } = useTranslation();
  return (
    <Callout icon={<Tick />} intent="success">
      <p>{t("Complete")}</p>
      <p>
        <EtherscanLink hash={hash} chainId={chainId} />
      </p>
    </Callout>
  );
};
