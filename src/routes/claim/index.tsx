import React from "react";

const ClaimError = () => {
  return (
    <section>
      <h1>SOMETHING DOESN’T LOOK RIGHT</h1>
      <p>If you have been given a link please double check and try again</p>
    </section>
  );
};

const ConnectedClaim = () => {
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
        <div style={{ backgroundColor: "green" }}></div>
        <div style={{ backgroundColor: "yellow" }}></div>
      </div>
    </section>
  );
};

const ClaimRouter = () => {
  const [connecting, setConnecting] = React.useState<boolean>(false);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const connect = React.useCallback(async () => {
    try {
      setConnecting(true);
      await new Promise((res) => {
        setTimeout(res, 1000);
      });
      setConnected(true);
    } catch {
      setError(true);
    } finally {
      setConnecting(false);
    }
  }, []);
  if (error) {
    return <ClaimError />;
  } else if (connected) {
    return <ConnectedClaim />;
  }
  return (
    <section>
      <p>
        You will need to connect to an ethereum wallet to pay the gas and claim
        Tokens.
      </p>
      {connecting ? (
        <div>Please check wallet</div>
      ) : (
        <button onClick={() => connect()}>Connect to an Ethereum wallet</button>
      )}
    </section>
  );
};

export default ClaimRouter;
