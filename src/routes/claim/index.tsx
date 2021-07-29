import React from "react";
import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { useSearchParams } from "../../hooks/use-search-params";
import { useVegaWeb3 } from "../../hooks/use-vega-web3";
import { EthereumChainIds } from "../../lib/vega-web3-utils";
// import VegaWeb3 from "../../lib/vega-web3";
// import { EthereumChainIds } from "../../lib/vega-web3-utils";
import { ClaimError } from "./claim-error";
import { claimReducer, initialClaimState } from "./claim-reducer";
import { ConnectedClaim } from "./connected";

const ClaimRouter = () => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const vega = useVegaWeb3(EthereumChainIds.Mainnet);
  const { appState } = useAppState();
  const [state, dispatch] = React.useReducer(claimReducer, initialClaimState);
  const connect = useConnect();

  // TODO: check this when url is finalized, values will be used for claim and reveal
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

  let pageContent = null;

  if (state.error) {
    pageContent = <ClaimError />;
  } else if (appState.address) {
    pageContent = <ConnectedClaim state={state} commitClaim={commitClaim} />;
  } else {
    pageContent = (
      <section>
        <p>
          {t(
            "You will need to connect to an ethereum wallet to pay the gas and claim tokens"
          )}
        </p>
        {!appState.hasProvider ? (
          <div>{t("invalidWeb3Browser")}</div>
        ) : appState.connecting ? (
          <div>{t("Please check wallet")}</div>
        ) : (
          <button onClick={connect}>
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
