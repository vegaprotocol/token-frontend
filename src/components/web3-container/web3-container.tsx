import React from "react";
import { Redirect } from "react-router-dom";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { SplashLoader } from "../splash-loader";

export const Web3Container = ({ children }: { children?: React.ReactNode }) => {
  const { appState } = useAppState();
  if (appState.providerLoading) {
    return <SplashLoader />;
  } else if (!appState.hasProvider) {
    return <Redirect to="/no-provider" />;
  }

  return <>{children}</>;
};
