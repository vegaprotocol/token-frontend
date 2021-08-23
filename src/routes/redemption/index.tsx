import { useTranslation } from "react-i18next";
import { Route, Switch } from "react-router-dom";
import { RouteChildProps } from "..";
import { DefaultTemplate } from "../../components/page-templates/default";
import { TrancheContainer } from "../../components/tranche-container";
import { Web3Container } from "../../components/web3-container";
import { useDocumentTitle } from "../../hooks/use-document-title";
import RedemptionRouter from "./redemption";

const RedemptionIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <DefaultTemplate title={t("pageTitleRedemption")}>
      <Web3Container>
        {(address) => (
          <TrancheContainer>
            {(tranches) => (
              <RedemptionRouter address={address} tranches={tranches} />
            )}
          </TrancheContainer>
        )}
      </Web3Container>
    </DefaultTemplate>
  );
};

export default RedemptionIndex;
