import { useTranslation } from "react-i18next";
import { TemplateDefault } from "../../components/page-templates/template-default";

const RewardRouter = () => {
  const { t } = useTranslation();
  return <TemplateDefault title={t("pageTitleRewards")}>Test</TemplateDefault>;
};

export default RewardRouter;
