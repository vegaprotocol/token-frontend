import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";

const NoProvider = () => {
  const { t } = useTranslation();
  return (
    <DefaultTemplate title={t("Cannot connect")}>
      <p>{t("invalidWeb3Browser")}</p>
    </DefaultTemplate>
  );
};

export default NoProvider;
