import { useTranslation } from "react-i18next";
import "./transaction-complete.scss";

export const TransactionComplete = ({ hash }: { hash: string | null }) => {
  const { t } = useTranslation();
  return (
    <div className="transaction-complete">
      {t("Complete")}
      <div>
        <a href={`https://etherscan.io/tx/${hash}`}>
          {t("View on Etherscan (opens in a new tab)")}
        </a>
      </div>
    </div>
  );
};
