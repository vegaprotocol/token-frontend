import React from "react";
import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";

const RedemptionRouter = () => {
  const { t } = useTranslation();
  return (
    <DefaultTemplate title={t("pageTitleRedemption")}>
      <div>Redemption</div>
    </DefaultTemplate>
  );
};

export default RedemptionRouter;
