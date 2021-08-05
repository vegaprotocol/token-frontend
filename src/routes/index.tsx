import React from "react";
import { Route, Switch } from "react-router-dom";
import { SplashLoader } from "../components/splash-loader";
import { SplashScreen } from "../components/splash-screen";
import { useAppState } from "../contexts/app-state/app-state-context";
import routerConfig from "./router-config";

export const AppRouter = () => {
  const {
    appState: { hasProvider },
  } = useAppState();

  const splashLoading = (
    <SplashScreen>
      <SplashLoader />
    </SplashScreen>
  );

  return hasProvider ? (
    <React.Suspense fallback={splashLoading}>
      <Switch>
        {routerConfig.map(
          ({ path, component: Component, exact = false, name }) => (
            <Route key={name} path={path} exact={exact} component={Component} />
          )
        )}
      </Switch>
    </React.Suspense>
  ) : (
    splashLoading
  );
};
