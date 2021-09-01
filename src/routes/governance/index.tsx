import { useTranslation } from "react-i18next";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { ProposalsList } from "./proposals-list";

const GovernanceRouter = () => {
  const { t } = useTranslation();
  return (
    <TemplateDefault title={t("pageTitleGovernance")}>
      <h1>{t("Governance")}</h1>
      <p>{t("This page lists proposed changes to the Vega network.")}</p>
      <p>{t("VEGA token holders can vote for or against proposals as well as make their own.")}</p>
      <p>{t( "Each proposal needs both a required majority of votes (e.g 66% but this differs by proposal type) and to meet a minimum threshold of votes.")}</p>
      <h1>{t("Proposals")}</h1>
      <ProposalsList />
    </TemplateDefault>
  );
};

export default GovernanceRouter;
