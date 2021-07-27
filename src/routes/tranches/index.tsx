import React from "react";
import { Route, Switch } from "react-router-dom";
import { Tranche } from "./tranche";
import { Tranches } from "./tranches";

const TrancheRouter = () => {
  return (
    <Switch>
      <Route path="/tranches" exact>
        <Tranches />
      </Route>
      <Route path="/tranches/:trancheId">
        <Tranche />
      </Route>
    </Switch>
  );
};

export default TrancheRouter;
