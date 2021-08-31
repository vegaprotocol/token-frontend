const TRUTHY = ["1", "true"];

export const Flags = {
  MOCK: TRUTHY.includes(process.env.REACT_APP_MOCKED!),
  MAINNET_LIVE: TRUTHY.includes(process.env.REACT_MAINNET_LIVE!),
  SHOW_NETWORK_SWITCHER: TRUTHY.includes(
    process.env.REACT_APP_SHOW_NETWORK_SWITCHER || ""
  ),
};
