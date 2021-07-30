import { useTranslation } from "react-i18next";

export const ClaimStep2 = () => {
  const { t } = useTranslation();
  return (
    <div data-testid="claim-step-2" style={{ padding: 15 }}>
      <h1>{t("step2Title")}</h1>
      <p>{t("step2Body")}</p>
      <p>{t("step2Note")}</p>
    </div>
  );
};
