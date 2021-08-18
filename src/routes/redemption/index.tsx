import React from "react";
import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { DefaultTemplate } from "../../components/page-templates/default";
import { TrancheContainer } from "../../components/tranche-container";
import { Web3Container } from "../../components/web3-container";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RedemptionInformation } from "./redemption-information";

const RedemptionRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  return (
    <DefaultTemplate title={t("pageTitleClaim")}>
      <Web3Container>
        <TrancheContainer>
          <RedemptionInformation />
        </TrancheContainer>
      </Web3Container>
    </DefaultTemplate>
  );
};

export default RedemptionRouter;
