import { useTranslation } from "react-i18next";
import { TemplateDefault } from "../../components/page-templates/template-default";

const GovernanceRouter = () => {
  const { t } = useTranslation();
  return (
    <TemplateDefault title={t("pageTitleGovernance")}>
      <div>{t("Governance is coming soon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</div>
    </TemplateDefault>
  );
};

export default GovernanceRouter;
