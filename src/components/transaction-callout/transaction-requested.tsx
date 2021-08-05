import { useTranslation } from "react-i18next";
import { Callout } from "../callout";

export const TransactionRequested = () => {
  const { t } = useTranslation();
  return (
    <Callout intent="warn">
      <p>{t("Awaiting action in Ethereum wallet (e.g. metamask)")}</p>
    </Callout>
  );
};
