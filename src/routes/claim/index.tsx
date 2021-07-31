import React from "react";
import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import { TransactionConfirm } from "../../components/transaction-confirm";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { useSearchParams } from "../../hooks/use-search-params";
import { useVegaWeb3 } from "../../hooks/use-vega-web3";
import { EthereumChainIds } from "../../lib/vega-web3-utils";
import { ClaimError } from "./claim-error";
import { claimReducer, initialClaimState } from "./claim-form/claim-reducer";
import { ConnectedClaim } from "./connected";
import { ClaimRestricted } from "./claim-restricted";
import { isRestricted } from "./lib/is-restricted";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import VegaClaim from "../../lib/vega-claim";

const ClaimRouter = () => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const vega = useVegaWeb3(EthereumChainIds.Mainnet);
  const { appState } = useAppState();
  const [state, dispatch] = React.useReducer(claimReducer, initialClaimState);
  const connect = useConnect();
  React.useEffect(() => {
    const run = async () => {
      dispatch({
        type: "SET_DATA_FROM_URL",
        data: {
          nonce: params.n,
          trancheId: params.t,
          expiry: params.ex,
          target: params.targ,
          denomination: params.d,
          code: params.r,
        },
      });
    };
    run();
  }, [dispatch, params, vega]);
  const commitClaim = React.useCallback(async () => {
    dispatch({ type: "CLAIM_TX_REQUESTED" });
    const provider = (await detectEthereumProvider()) as any;
    const web3 = new Web3(provider);
    const claim = new VegaClaim(
      web3,
      "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21"
    );
    claim
      .commit(state.code!, appState.address!)
      .once("transactionHash", (hash: string) => {
        dispatch({ type: "CLAIM_TX_SUBMITTED", txHash: hash });
      })
      .once("receipt", (receipt: any) => {
        dispatch({ type: "CLAIM_TX_COMPLETE", receipt });
      })
      .once("error", (err: Error) => {
        console.log(err);
        dispatch({ type: "CLAIM_TX_ERROR", error: err });
      });
  }, [appState.address, state.code]);
  const claim = React.useCallback(async () => {
    dispatch({ type: "CLAIM_TX_REQUESTED" });
    const provider = (await detectEthereumProvider()) as any;
    const web3 = new Web3(provider);
    const claim = new VegaClaim(
      web3,
      "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21"
    );
    claim
      .claim({
        claimCode: state.code!,
        denomination: state.denomination!,
        trancheId: state.trancheId!,
        expiry: state.expiry!,
        nonce: state.nonce!,
        country: "GB",
        targeted: !!state.target,
        account: appState.address!,
      })
      .once("transactionHash", (hash: string) => {
        dispatch({ type: "CLAIM_TX_SUBMITTED", txHash: hash });
      })
      .once("receipt", (receipt: any) => {
        dispatch({ type: "CLAIM_TX_COMPLETE", receipt });
      })
      .once("error", (err: Error) => {
        console.log(err);
        dispatch({ type: "CLAIM_TX_ERROR", error: err });
      });
  }, [
    appState.address,
    state.code,
    state.denomination,
    state.expiry,
    state.nonce,
    state.target,
    state.trancheId,
  ]);

  let pageContent;

  if (isRestricted()) {
    pageContent = <ClaimRestricted />;
  } else if (state.error) {
    pageContent = <ClaimError />;
  } else if (appState.address) {
    pageContent = (
      <ConnectedClaim
        state={state}
        commitClaim={commitClaim}
        claim={claim}
        dispatch={dispatch}
      />
    );
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
          <TransactionConfirm />
        ) : (
          <button
            onClick={connect}
            style={{ backgroundColor: "#074EE8", color: "white" }}
          >
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
