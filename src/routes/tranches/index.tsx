import React from "react";
import { Route, Switch } from "react-router-dom";
import { Tranche } from "./tranche";
import { Tranches } from "./tranches";
import type { Tranche as TrancheType } from "../../lib/vega-web3-types";
import { EthereumChainIds } from "../../lib/vega-web3-utils";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useTranslation } from "react-i18next";
import { useVegaWeb3 } from "../../hooks/use-vega-web3";

const TrancheRouter = () => {
  const { t } = useTranslation();
  const [tranches, setTranches] = React.useState<TrancheType[]>([]);
  const vega = useVegaWeb3(EthereumChainIds.Mainnet);

  React.useEffect(() => {
    async function getTranches() {
      const res = await vega.getAllTranches();
      setTranches(res);
    }

    getTranches();
  }, [vega]);
  return (
    <DefaultTemplate title={t("pageTitleTranches")}>
      <Switch>
        <Route path="/tranches" exact>
          <Tranches tranches={tranches} />
        </Route>
        <Route path="/tranches/:trancheId">
          <Tranche tranches={tranches} />
        </Route>
      </Switch>
    </DefaultTemplate>
  );
};

export default TrancheRouter;
