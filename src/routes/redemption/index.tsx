import React from "react";
import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useDocumentTitle } from "../../hooks/use-document-title";

const RedemptionRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  return (
    <DefaultTemplate title={t("pageTitleRedemption")}>
      <div>Redemption</div>
    </DefaultTemplate>
  );
};

export default RedemptionRouter;
