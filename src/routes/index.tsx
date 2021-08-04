import React from "react";
import { Route, Switch } from "react-router-dom";
import { Loading } from "../components/loading";
import { useAppState } from "../contexts/app-state/app-state-context";
import NotFound from "./not-found";
import routerConfig from "./router-config";

export const AppRouter = () => {
  const {
    appState: { hasProvider },
  } = useAppState();
  return hasProvider ? (
    <React.Suspense fallback={<Loading />}>
      <Switch>
        {routerConfig.map(
          ({ path, component: Component, exact = false, name }) => (
            <Route key={name} path={path} exact={exact} component={Component} />
          )
        )}
        <Route component={NotFound} />
      </Switch>
    </React.Suspense>
  ) : (
    <Loading />
  );
};
