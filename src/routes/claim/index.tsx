import React from "react";
import VegaWeb3 from "../../lib/vega-web3";
import { EthereumChainIds } from "../../lib/vega-web3-utils";
import { ClaimError } from "./claim-error";
import { ConnectedClaim } from "./connected";

const ClaimRouter = () => {
  React.useEffect(() => {
    async function getTranches() {
      const vega = new VegaWeb3(EthereumChainIds.Mainnet);
      await vega.getAllTranches();
    }

    getTranches();
  }, []);

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
