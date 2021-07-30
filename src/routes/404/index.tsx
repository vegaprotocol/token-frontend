import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";

export const NotFound = () => {
  const { t } = useTranslation();
  return (
    <DefaultTemplate title={t("pageTitle404")}>
      <p>
        {t("This page can not be found, please check the URL and try again.")}
      </p>
    </DefaultTemplate>
  );
};
