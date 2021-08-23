import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import { Web3Container } from "../../components/web3-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";

const Associate = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <DefaultTemplate title={t("pageTitleAssociate")}>
      <Web3Container>Test</Web3Container>
    </DefaultTemplate>
  );
};

export default Associate;
