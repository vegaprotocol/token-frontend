import React from "react";
import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/vega-web3-utils";
import { EtherscanLink } from "../etherscan-link";

export interface TransactionErrorProps {
  error: Error | null;
  hash: string | null;
  onActionClick: () => void;
  chainId: EthereumChainId;
}

export const TransactionError = ({
  error,
  hash,
  chainId,
  onActionClick,
}: TransactionErrorProps) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#484848",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <h1>{error ? error.message : t("Something went wrong")}</h1>
      {hash ? <EtherscanLink hash={hash} chainId={chainId} /> : null}
      <button onClick={() => onActionClick()}>{t("Try again")}</button>
    </div>
  );
};
