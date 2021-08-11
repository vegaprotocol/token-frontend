import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useDocumentTitle } from "../../hooks/use-document-title";

const NotFound = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  return (
    <DefaultTemplate title={t("pageTitle404")}>
      <p>
        {t("This page can not be found, please check the URL and try again.")}
      </p>
    </DefaultTemplate>
  );
};

export default NotFound;
