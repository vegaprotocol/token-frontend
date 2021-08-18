import React from "react";
import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { Connect } from "../../components/connect";
import { DefaultTemplate } from "../../components/page-templates/default";
import { TrancheContainer } from "../../components/tranche-container";
import { Web3Container } from "../../components/web3-container";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RedemptionInformation } from "./redemption-information";

const RedemptionRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { appState } = useAppState();
  const { t } = useTranslation();
  let pageContent = appState.address ? <RedemptionInformation /> : <Connect />;
  return (
    <DefaultTemplate title={t("pageTitleClaim")}>
      <Web3Container>
        <TrancheContainer>{pageContent}</TrancheContainer>
      </Web3Container>
    </DefaultTemplate>
  );
};

export default RedemptionRouter;
