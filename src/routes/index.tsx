import React from "react";
import { Route, Switch } from "react-router-dom";
import { Loading } from "../components/loading";
import routerConfig from "./router-config";

export const AppRouter = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <Switch>
        {routerConfig.map(
          ({ path, component: Component, exact = false, name }) => (
            <Route key={name} path={path} exact={exact} component={Component} />
          )
        )}
      </Switch>
    </React.Suspense>
  );
};
