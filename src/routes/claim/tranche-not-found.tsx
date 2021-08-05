import { useTranslation } from "react-i18next";

// TODO: Provide a better message
export const TrancheNotFound = () => {
  const { t } = useTranslation();
  return (
    <div>
      <p>{t("Tranche not found")}</p>
    </div>
  );
};
