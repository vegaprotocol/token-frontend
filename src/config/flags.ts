const TRUTHY = ["1", "true"];

export const Flags = {
  MOCK: TRUTHY.includes(process.env.REACT_APP_MOCKED!),
  MAINNET_DISABLED: TRUTHY.includes(process.env.REACT_APP_MAINNET_DISABLED!),
  DEX_STAKING_DISABLED: TRUTHY.includes(process.env.REACT_APP_DEX_STAKING_DISABLED!),
};
