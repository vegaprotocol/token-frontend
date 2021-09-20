const TRUTHY = ["1", "true"];

export const Flags = {
  IN_CONTEXT_TRANSLATION: TRUTHY.includes(
    process.env.REACT_APP_IN_CONTEXT_TRANSLATION!
  ),
  MOCK: TRUTHY.includes(process.env.REACT_APP_MOCKED!),
  MAINNET_DISABLED: TRUTHY.includes(process.env.REACT_APP_MAINNET_DISABLED!),
  DEX_STAKING_DISABLED: TRUTHY.includes(
    process.env.REACT_APP_DEX_STAKING_DISABLED!
  ),
  GOVERNANCE_DISABLED: TRUTHY.includes(
    process.env.REACT_APP_GOVERNANCE_DISABLED!
  ),
};
