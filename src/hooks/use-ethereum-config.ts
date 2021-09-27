import React from "react";
import * as Sentry from "@sentry/react";
import { useNetworkParam } from "../routes/governance/use-network-param";

export const ETH_NETWORK_PARAM = "blockchains.ethereumConfig";

export const useEthereumConfig = () => {
  const { data: ethereumConfigJSON, loading } = useNetworkParam([
    ETH_NETWORK_PARAM,
  ]);
  const ethereumConfig = React.useMemo(() => {
    if (!ethereumConfigJSON && !loading) {
      Sentry.captureMessage(
        `No ETH config found for network param ${ETH_NETWORK_PARAM}`
      );
      return null;
    } else if (!ethereumConfigJSON) {
      return null;
    }
    try {
      const [configJson] = ethereumConfigJSON;
      const config = JSON.parse(configJson);
      return config;
    } catch {
      Sentry.captureMessage("Ethereum config JSON is invalid");
      return null;
    }
  }, [ethereumConfigJSON, loading]);

  if (!ethereumConfig) {
    return null;
  }

  return {
    confirmations: ethereumConfig.confirmations,
  };
};
