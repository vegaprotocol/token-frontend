export const Flags = {
  MOCK: ["1", "true"].includes(process.env.REACT_APP_MOCKED!),
  SHOW_NETWORK_SWITCHER: ["1", "true"].includes(
    process.env.REACT_APP_SHOW_NETWORK_SWITCHER || ""
  ),
};
