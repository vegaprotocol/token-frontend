import { useTranslation } from "react-i18next";
import "./transaction-in-progress.scss";

export const TransactionsInProgress = ({ hash }: { hash: string | null }) => {
  const { t } = useTranslation();
  return (
    <div className="transaction-in-progress">
      {t("Transaction in progress")}
      <div>
        <a href={`https://etherscan.io/tx/${hash}`}>
          {t("View on Etherscan (opens in a new tab)")}
        </a>
      </div>
    </div>
  );
};
