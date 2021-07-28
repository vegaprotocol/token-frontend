import React from "react";
import { useTranslation } from "react-i18next";
// import VegaWeb3 from "../../lib/vega-web3";
// import { EthereumChainIds } from "../../lib/vega-web3-utils";
import { ClaimError } from "./claim-error";
import { ConnectedClaim } from "./connected";

const ClaimRouter = () => {
  const { t } = useTranslation();

  React.useCallback(() => {
    async function getTranches() {}

    getTranches();
  }, []);

  const [connecting, setConnecting] = React.useState<boolean>(false);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(true);
  const connect = React.useCallback(async () => {
    try {
      setConnecting(true);

      // const vega = new VegaWeb3(EthereumChainIds.Mainnet);
      // // @ts-ignore
      // if (!window.ethereum) {
      //   throw new Error("Could not find Ethereum provider");
      // }
      // await vega.web3.eth.net.isListening();
      // await vega.web3.eth.requestAccounts();
      setConnected(true);
    } catch (e) {
      console.log(e);
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
      <p>{t("You will need to connect to an ethereum wallet to pay the gas and claim tokens")}</p>
      {connecting ? (
        <div>{t("Please check wallet")}</div>
      ) : (
        <button onClick={() => connect()}>{t("Connect to an Ethereum wallet")}</button>
      )}
    </section>
  );
};

export default ClaimRouter;
