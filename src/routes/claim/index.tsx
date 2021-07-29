import React from "react";
import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useSearchParams } from "../../hooks/use-search-params";
import { useVegaWeb3 } from "../../hooks/use-vega-web3";
import { EthereumChainIds } from "../../lib/vega-web3-utils";
// import VegaWeb3 from "../../lib/vega-web3";
// import { EthereumChainIds } from "../../lib/vega-web3-utils";
import { ClaimError } from "./claim-error";
import { claimReducer, initialClaimState } from "./claim-reducer";
import { ConnectedClaim } from "./connected";

const ClaimRouter = () => {
  const vega = useVegaWeb3(EthereumChainIds.Mainnet);
  const { t } = useTranslation();
  const params = useSearchParams();
  const [state, dispatch] = React.useReducer(claimReducer, initialClaimState);

  React.useEffect(() => {
    dispatch({ type: "SET_DATA_FROM_URL", data: params });
  }, [params]);

  const commitClaim = React.useCallback(async () => {
    dispatch({ type: "CLAIM_TX_REQUESTED" });
    const promi = vega.commitClaim();
    console.log(promi);
    promi
      .on("transactionHash", (hash: string) => {
        dispatch({ type: "CLAIM_TX_SUBMITTED", txHash: hash });
      })
      .on("receipt", (receipt: any) => {
        dispatch({ type: "CLAIM_TX_COMPLETE", receipt });
      })
      .on("error", (err) => {
        dispatch({ type: "CLAIM_TX_ERROR", error: err });
      });
  }, [vega]);

  const connect = React.useCallback(async () => {
    try {
      dispatch({ type: "CONNECT" });

      // const vega = new VegaWeb3(EthereumChainIds.Mainnet);
      // // @ts-ignore
      // if (!window.ethereum) {
      //   throw new Error("Could not find Ethereum provider");
      // }
      // await vega.web3.eth.net.isListening();
      // await vega.web3.eth.requestAccounts();
      dispatch({ type: "CONNECTED", address: "0x123" });
    } catch (e) {
      dispatch({ type: "ERROR", error: e });
    } finally {
    }
  }, []);

  let pageContent = null;

  if (state.error) {
    pageContent = <ClaimError />;
  } else if (state.address) {
    pageContent = <ConnectedClaim state={state} commitClaim={commitClaim} />;
  } else {
    pageContent = (
      <section>
        <p>
          {t(
            "You will need to connect to an ethereum wallet to pay the gas and claim tokens"
          )}
        </p>
        {state.connecting ? (
          <div>{t("Please check wallet")}</div>
        ) : (
          <button onClick={() => connect()}>
            {t("Connect to an Ethereum wallet")}
          </button>
        )}
      </section>
    );
  }

  return (
    <DefaultTemplate title={t("pageTitleClaim")}>{pageContent}</DefaultTemplate>
  );
};

export default ClaimRouter;
