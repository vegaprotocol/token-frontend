import { Route, Switch } from "react-router-dom";
import { Tranche } from "./tranche";
import { Tranches } from "./tranches";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useTranslation } from "react-i18next";
import { Web3Container } from "../../components/web3-container";

const TrancheRouter = () => {
  const { t } = useTranslation();

  return (
    <Web3Container>
      <DefaultTemplate title={t("pageTitleTranches")}>
        <Switch>
          <Route path="/tranches" exact>
            <Tranches />
          </Route>
          <Route path="/tranches/:trancheId">
            <Tranche />
          </Route>
        </Switch>
      </DefaultTemplate>
    </Web3Container>
  );
};

export default TrancheRouter;
