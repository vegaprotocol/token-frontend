import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Tranche } from "./tranche";
import { Tranches } from "./tranches";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RouteChildProps } from "..";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { useTranches } from "../../hooks/use-tranches";
import { Flags } from "../../config";
import { Heading } from "../../components/heading";

const TrancheRouter = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  const { t } = useTranslation();
  const match = useRouteMatch();
  const tranches = useTranches();

  if (!tranches.length) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <>
      <Heading title={t("pageTitleTranches")} />
      {Flags.REDEEM_DISABLED ? (
        <p>{t("redeemComingSoon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</p>
      ) : (
        <Switch>
          <Route path={match.path} exact>
            <Tranches tranches={tranches} />
          </Route>
          <Route path={`${match.path}/:trancheId`}>
            <Tranche tranches={tranches} />
          </Route>
        </Switch>
      )}
    </>
  );
};

export default TrancheRouter;
