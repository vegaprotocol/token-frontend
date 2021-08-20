import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import Claim from "./claim";
import { Web3Container } from "../../components/web3-container";
import { TrancheContainer } from "../../components/tranche-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";

const ClaimIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <DefaultTemplate title={t("pageTitleClaim")}>
      <Web3Container>
        <TrancheContainer>
          <Claim />
        </TrancheContainer>
      </Web3Container>
    </DefaultTemplate>
  );
};

export default ClaimIndex;
