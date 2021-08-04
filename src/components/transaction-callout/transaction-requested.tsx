import { useTranslation } from "react-i18next";

export const TransactionRequested = () => {
  const { t } = useTranslation();
  return <p>{t("Awaiting action in Ethereum wallet (e.g. metamask)")}</p>;
};
