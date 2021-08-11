export const Flags = {
  MOCK: ["1", "true"].includes(process.env.REACT_APP_MOCKED!),
  REDEEM_ENABLED: ["1", "true"].includes(process.env.REACT_APP_REDEEM_LIVE!),
  SHOW_NETWORK_SWITCHER: ["1", "true"].includes(
    process.env.REACT_APP_SHOW_NETWORK_SWITCHER || ""
  ),
};
