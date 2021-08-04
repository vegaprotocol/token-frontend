import React from "react";
import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../lib/web3-utils";
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
    <>
      <p>{error ? error.message : t("Something went wrong")}</p>
      {hash ? (
        <p>
          <EtherscanLink hash={hash} chainId={chainId} />
        </p>
      ) : null}
      <button onClick={() => onActionClick()}>{t("Try again")}</button>
    </>
  );
};
