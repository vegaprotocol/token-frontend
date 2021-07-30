import React from "react";
import { useTranslation } from "react-i18next";

export interface TransactionErrorProps {
  error: Error | null;
  hash: string | null;
  onActionClick?: () => void;
}

export const TransactionError = ({
  error,
  hash,
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
      {hash ? (
        <a
          href={`https://etherscan.io/tx/${hash}`}
          target="_blank"
          rel="noreferrer"
        >
          {t("View on Etherscan (Opens in a new tab)")}
        </a>
      ) : null}
      <button onClick={() => (onActionClick ? onActionClick() : null)}>
        {t("Try again")}
      </button>
    </div>
  );
};
