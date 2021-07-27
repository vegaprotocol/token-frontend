import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Loading } from "../components/loading";
import routerConfig from "./router-config";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <React.Suspense fallback={<Loading />}>
          {routerConfig.map(({ path, component: Component, exact = false }) => (
            <Route path={path} exact={exact}>
              <Component />
            </Route>
          ))}
        </React.Suspense>
      </Switch>
    </Router>
  );
};
