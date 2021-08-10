import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";

const NotPermitted = () => {
  const { t } = useTranslation();
  return (
    <DefaultTemplate title={t("pageTitleNotPermitted")}>
      <p>{t("You cannot claim VEGA tokens if you reside in that country")}</p>
    </DefaultTemplate>
  );
};

export default NotPermitted;
