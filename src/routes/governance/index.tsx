import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { useDocumentTitle } from "../../hooks/use-document-title";

const GovernanceRouter = ({ name }: RouteChildProps) => {
  const { t } = useTranslation();
  useDocumentTitle(name);
  return (
    <TemplateDefault title={t("pageTitleGovernance")}>
      <div>{t("Governance is coming soon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</div>
    </TemplateDefault>
  );
};

export default GovernanceRouter;
