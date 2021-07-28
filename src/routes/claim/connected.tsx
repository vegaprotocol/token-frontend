import React from "react";

export const ConnectedClaim = () => {
  const code = "0xf780...d296Cb";
  const trancheName = "tranch 2";
  const showRedeem = false; // TODO needs to be false until we build this
  const trancheEndDate = "June 5 2023";
  const unlockDate = "5th March 2022";
  const pubkey = "0x" + "0".repeat(40);
  return (
    <section>
      <p>
        This code ({code}) entiles{" "}
        {pubkey ? <strong>{pubkey}</strong> : <strong>the holder</strong>} to
        200 Vega tokens from {trancheName} of the vesting contract. Meaning
        tokens will be locked until {unlockDate}, Then they will gradually
        become unlocked, block by block, until {trancheEndDate} when they are
        fully unlocked/sellable.{" "}
        {showRedeem
          ? "You’ll be able to redeem your unlocked tokens at token.vega.xyz/redemption"
          : null}
      </p>
      <div
        style={{
          display: "grid",
          height: 200,
          gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid white",
          paddingTop: 15,
        }}
      >
        <div style={{ padding: 15, borderRight: "1px solid white" }}>
          <h1>Step 1 - Commit your claim.</h1>
          <p>
            This posts your claim to the Ethereum chain in an way where it can
            not be used by another address
          </p>
          <form>
            <fieldset>
              <select>
                <option>Please select your country</option>
                <option>Earth</option>
              </select>
            </fieldset>
            <fieldset>
              <input type="checkbox"></input>
              <label>I accept the terms and Conditions</label>
            </fieldset>
            <button>Continue</button>
          </form>
        </div>
        <div style={{ padding: 15 }}>
          <h1>Step 2 - Reveal your claim.</h1>
          <p>
            You’ll need to wait at least one block after step 1 before making
            step 2. This sends a message to the chain that reveals your claim.
          </p>
          <p>You must complete step 1 first.</p>
        </div>
      </div>
    </section>
  );
};
