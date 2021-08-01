export const LockedBanner = () => {
  return (
    <div style={{ padding: 20, border: "1px solid white" }}>
      <p>
        Keep track of locked tokens in your wallet with the VEGA (VESTING)
        token.
      </p>
      <p>
        Add the Vega vesting token to your wallet to track how much you Vega you
        have in the vesting contract.
      </p>
      <p>
        {/* TODO get the address for the locked vega contract */}
        The token address is 0xufb8y3bv8wur4uhr. Hit the add token button in
        your ERC20 wallet and enter this address.
      </p>
    </div>
  );
};
