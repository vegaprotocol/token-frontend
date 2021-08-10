import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/web3-utils";

export const etherscanUrls: Record<EthereumChainId, string> = {
  "0x1": "https://etherscan.io",
  "0x3": "https://ropsten.etherscan.io",
  "0x4": "https://rinkeby.etherscan.io",
  "0x5": "https://goerli.etherscan.io",
  "0x2a": "https://kovan.etherscan.io",
};

export const EtherscanLink = ({
  chainId,
  hash,
  text,
}: {
  chainId: EthereumChainId;
  hash: string;
  text?: string;
}) => {
  const { t } = useTranslation();
  text = text ? text : t("View on Etherscan (opens in a new tab)");

  return (
    <a
      className="etherscan-link"
      target="_blank"
      rel="noreferrer"
      href={`${etherscanUrls[chainId]}/tx/${hash}`}
    >
      {text}
    </a>
  );
};
