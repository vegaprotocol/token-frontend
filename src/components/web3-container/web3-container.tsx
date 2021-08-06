import React from "react";
import { Redirect } from "react-router-dom";
import {
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";

export const Web3Container = ({ children }: { children?: React.ReactNode }) => {
  const { appState } = useAppState();
  if (appState.providerStatus === ProviderStatus.None) {
    return <Redirect to="/no-provider" />;
  }

  return <>{children}</>;
};
