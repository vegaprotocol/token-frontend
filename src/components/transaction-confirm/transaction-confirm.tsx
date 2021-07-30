import { useTranslation } from "react-i18next";
import "./transaction-confirm.scss";

export const TransactionConfirm = () => {
  const { t } = useTranslation();
  return (
    <div className="transaction-confirm">
      {t("Awaiting action in Ethereum wallet (e.g. metamask)")}
    </div>
  );
};
