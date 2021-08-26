import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { TrancheContainer } from "../../components/tranche-container";
import { Web3Container } from "../../components/web3-container";
import { useDocumentTitle } from "../../hooks/use-document-title";
import RedemptionRouter from "./redemption";

const RedemptionIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <TemplateDefault title={t("pageTitleRedemption")}>
      <Web3Container>
        {(address) => (
          <TrancheContainer address={address}>
            {(tranches) => (
              <RedemptionRouter address={address} tranches={tranches} />
            )}
          </TrancheContainer>
        )}
      </Web3Container>
    </TemplateDefault>
  );
};

export default RedemptionIndex;
