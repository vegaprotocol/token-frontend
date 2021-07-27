import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routerConfig from "./router-config";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <React.Suspense fallback={"loading"}>
          {routerConfig.map(({ path, component: Component }) => (
            <Route path={path}>
              <Component />
            </Route>
          ))}
        </React.Suspense>
      </Switch>
    </Router>
  );
};
