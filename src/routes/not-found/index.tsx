import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { useDocumentTitle } from "../../hooks/use-document-title";

const NotFound = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  return (
    <TemplateDefault title={t("pageTitle404")}>
      <p>
        {t("This page can not be found, please check the URL and try again.")}
      </p>
    </TemplateDefault>
  );
};

export default NotFound;
