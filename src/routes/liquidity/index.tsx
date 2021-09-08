import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { TemplateDefault } from "../../components/page-templates/template-default";
import { Flags } from "../../flags";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { LiquidityContainer } from "./liquidity-container";

const RedemptionIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <TemplateDefault title={t("pageTitleLiquidity")}>
      {Flags.DEX_STAKING_DISABLED ? (
        <p>{t("liquidityComingSoon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</p>
      ) : (
        <LiquidityContainer />
      )}
    </TemplateDefault>
  );
};

export default RedemptionIndex;
