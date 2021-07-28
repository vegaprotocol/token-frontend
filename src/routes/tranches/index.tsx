import React from "react";
import { Route, Switch } from "react-router-dom";
import { Tranche } from "./tranche";
import { Tranches } from "./tranches";
import VegaWeb3 from "../../lib/vega-web3";
import type { Tranche as TrancheType } from "../../lib/vega-web3-types";
import { EthereumChainIds } from "../../lib/vega-web3-utils";
import { DefaultTemplate } from "../../components/page-templates/default";

const TrancheRouter = () => {
  const [tranches, setTranches] = React.useState<TrancheType[]>([]);

  React.useEffect(() => {
    async function getTranches() {
      const vega = new VegaWeb3(EthereumChainIds.Mainnet);
      const res = await vega.getAllTranches();
      setTranches(res);
    }

    getTranches();
  }, []);
  return (
    <DefaultTemplate>
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
