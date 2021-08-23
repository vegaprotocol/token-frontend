import { useTranslation } from "react-i18next";
import Claim from "./claim";
import { Web3Container } from "../../components/web3-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { TrancheContainer } from "../../components/tranche-container";
import { isRestricted } from "./lib/is-restricted";
import { ClaimRestricted } from "./claim-restricted";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { VegaTokenContainer } from "../../components/vega-token-container";

const ClaimIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <TemplateDefault title={t("pageTitleClaim")}>
      {isRestricted() ? (
        <ClaimRestricted />
      ) : (
        <Web3Container>
          {(address) => (
            <VegaTokenContainer>
              {() => (
                <TrancheContainer>
                  {(tranches) => (
                    <Claim address={address} tranches={tranches} />
                  )}
                </TrancheContainer>
              )}
            </VegaTokenContainer>
          )}
        </Web3Container>
      )}
    </TemplateDefault>
  );
};

export default ClaimIndex;
