import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useDocumentTitle } from "../../hooks/use-document-title";

const NotPermitted = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  return (
    <DefaultTemplate title={t("pageTitleNotPermitted")}>
      <p>{t("You cannot claim VEGA tokens if you reside in that country")}</p>
    </DefaultTemplate>
  );
};

export default NotPermitted;
