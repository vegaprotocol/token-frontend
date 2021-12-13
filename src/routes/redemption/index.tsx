import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { RouteChildProps } from "..";
import { Heading } from "../../components/heading";
import { useDocumentTitle } from "../../hooks/use-document-title";
import RedemptionRouter from "./redemption";

const RedemptionIndex = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();
  const tranche = useRouteMatch(`${match.path}/:id`);

  return (
    <>
      <Heading
        title={
          tranche ? t("pageTitleRedemptionTranche") : t("pageTitleRedemption")
        }
      />
      <RedemptionRouter />
    </>
  );
};

export default RedemptionIndex;
