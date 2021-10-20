import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { Heading } from "../../components/heading";
import { useDocumentTitle } from "../../hooks/use-document-title";

const NotPermitted = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  return (
    <>
      <Heading title={t("pageTitleNotPermitted")} />
      <p>{t("You cannot claim VEGA tokens if you reside in that country")}</p>
    </>
  );
};

export default NotPermitted;
