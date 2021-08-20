import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import Claim from "./claim";
import { Web3Container } from "../../components/web3-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { TrancheContainer } from "../../components/tranche-container";

const ClaimIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <DefaultTemplate title={t("pageTitleClaim")}>
      <Web3Container>
        {(address) => (
          <TrancheContainer>
            {(tranches) => <Claim address={address} tranches={tranches} />}
          </TrancheContainer>
        )}
      </Web3Container>
    </DefaultTemplate>
  );
};

export default ClaimIndex;
