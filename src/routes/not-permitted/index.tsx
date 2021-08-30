import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { useDocumentTitle } from "../../hooks/use-document-title";

const NotPermitted = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  return (
    <TemplateDefault title={t("pageTitleNotPermitted")}>
      <p>{t("You cannot claim VEGA tokens if you reside in that country")}</p>
    </TemplateDefault>
  );
};

export default NotPermitted;
