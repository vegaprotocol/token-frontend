import "./etherscan-link.scss";

import { Popover, PopoverInteractionKind } from "@blueprintjs/core";

import { EthereumChainId } from "../../config";
import { useCopyToClipboard } from "../../hooks/use-copy-to-clipboard";
import { useTranslation } from "react-i18next";

const etherscanUrls: Record<EthereumChainId, string> = {
  "0x1": "https://etherscan.io",
  "0x3": "https://ropsten.etherscan.io",
  "0x4": "https://rinkeby.etherscan.io",
  "0x5": "https://goerli.etherscan.io",
  "0x2a": "https://kovan.etherscan.io",
};

interface BaseEtherscanLinkProps {
  chainId: EthereumChainId | null;
  text?: string;
  copyToClipboard?: CopyToClipboardType;
}

interface EtherscanAddressLinkProps extends BaseEtherscanLinkProps {
  address: string;
}

interface EtherscanTransactionLinkProps extends BaseEtherscanLinkProps {
  tx: string;
}

type EtherscanLinkProps =
  | EtherscanAddressLinkProps
  | EtherscanTransactionLinkProps;

export enum CopyToClipboardType {
  NONE,
  TEXT,
  LINK,
}

/**
 * Form an HTML link tag pointing to an appropriate Etherscan page
 */
export const EtherscanLink = ({
  chainId,
  text,
  copyToClipboard = CopyToClipboardType.TEXT,
  ...props
}: EtherscanLinkProps) => {
  let hash: string;
  let txLink: string | null;
  const { t } = useTranslation();
  const { copy, copied } = useCopyToClipboard();
  const linkText = text ? text : t("View on Etherscan (opens in a new tab)");
  const createLink = etherscanLinkCreator(chainId);

  if ("tx" in props) {
    hash = props.tx;
    txLink = createLink ? createLink.tx(hash) : null;
  } else {
    hash = props.address;
    txLink = createLink ? createLink.address(hash) : null;
  }

  // Fallback: just render the TX id
  if (!txLink) {
    return <span>{hash}</span>;
  }

  const generateClipboard = () => {
    switch (copyToClipboard) {
      case CopyToClipboardType.TEXT:
        return linkText;
      case CopyToClipboardType.LINK:
        return txLink || hash || "";
      default:
        return "";
    }
  };

  const getContents = (): JSX.Element => {
    return (
      <button
        className="etherscan-link__copy-to-clipboard"
        onClick={() => {
          copy(generateClipboard());
        }}
      >
        {copied ? t("copied!") : t("copyToClipboard")}
      </button>
    );
  };

  const linkClassName =
    copyToClipboard === CopyToClipboardType.LINK ? "" : "etherscan-link__mono";

  return copyToClipboard !== CopyToClipboardType.NONE ? (
    <Popover
      hoverOpenDelay={500}
      interactionKind={PopoverInteractionKind.HOVER}
    >
      <a href={txLink} target="_blank" rel="noreferrer" className={linkClassName}>
        {linkText}
      </a>
      {getContents()}
    </Popover>
  ) : (
    <a href={txLink} target="_blank" rel="noreferrer" className={linkClassName}>
      {linkText}
    </a>
  );
};

function etherscanLinkCreator(chainId: EthereumChainId | null) {
  if (!chainId) return null;

  const url = etherscanUrls[chainId];

  return {
    tx: (tx: string) => {
      if (!url) return null;
      return `${url}/tx/${tx}`;
    },
    address: (address: string) => {
      if (!url) return null;
      return `${url}/address/${address}`;
    },
  };
}

EtherscanLink.displayName = "EtherScanLink";
