import React from "react";
import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { useSearchParams } from "../../hooks/use-search-params";
import { ClaimError } from "./claim-error";
import { claimReducer, ClaimStatus, initialClaimState } from "./claim-reducer";
import { ClaimFlow } from "./claim-flow";
import { ClaimRestricted } from "./claim-restricted";
import { isRestricted } from "./lib/is-restricted";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Callout } from "../../components/callout";
import { TransactionCallout } from "../../components/transaction-callout";
import { TxStatus } from "../../hooks/transaction-reducer";
import { EthereumChainIds } from "../../lib/web3-utils";
import { ArrowTopRight } from "../../components/icons";

const Claim = () => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const { appState, appDispatch } = useAppState();
  const vesting = useVegaVesting();
  const [state, dispatch] = React.useReducer(claimReducer, initialClaimState);
  const connect = useConnect();

  React.useEffect(() => {
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
  }, [dispatch, params]);

  // If the claim has been committed refetch the new VEGA balance
  React.useEffect(() => {
    if (state.claimStatus === ClaimStatus.Finished && appState.address) {
      vesting
        .getUserBalanceAllTranches(appState.address)
        .then((balance) => appDispatch({ type: "SET_BALANCE", balance }));
    }
  }, [vesting, state.claimStatus, appState.address, appDispatch]);

  let pageContent;

  if (isRestricted()) {
    pageContent = <ClaimRestricted />;
  } else if (state.error) {
    pageContent = <ClaimError />;
  } else if (appState.address && state.code) {
    pageContent = <ClaimFlow state={state} dispatch={dispatch} />;
  } else if (!appState.address) {
    pageContent = (
      <>
        <p>
          {t(
            "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas."
          )}
        </p>
        {!appState.hasProvider ? (
          <div>{t("invalidWeb3Browser")}</div>
        ) : appState.connecting ? (
          <Callout>{t("Connect to metamask")}</Callout>
        ) : (
          <button onClick={connect}>
            {t("Connect to an Ethereum wallet")}
          </button>
        )}
      </>
    );
  }

  return (
    <DefaultTemplate title={t("pageTitleClaim")}>
      <Callout icon={<ArrowTopRight />}>{t("Connect to metamask")}</Callout>
      <TransactionCallout
        state={{
          txState: TxStatus.Requested,
          txData: { hash: null, receipt: null, error: null },
        }}
        reset={() => console.log("reset")}
        chainId={EthereumChainIds.Ropsten}
        complete={false}
      />
      <TransactionCallout
        state={{
          txState: TxStatus.Pending,
          txData: { hash: "0x" + "0".repeat(40), receipt: null, error: null },
        }}
        reset={() => console.log("reset")}
        chainId={EthereumChainIds.Ropsten}
        complete={false}
      />
      <TransactionCallout
        state={{
          txState: TxStatus.Complete,
          txData: {
            hash: "0x" + "0".repeat(40),
            receipt: { foo: "bar" },
            error: null,
          },
        }}
        reset={() => console.log("reset")}
        chainId={EthereumChainIds.Ropsten}
        complete={false}
      />
      <TransactionCallout
        state={{
          txState: TxStatus.Error,
          txData: {
            hash: "0x" + "0".repeat(40),
            receipt: {},
            error: new Error("foo"),
            userFacingError: new Error("Something went wrong"),
          },
        }}
        reset={() => console.log("reset")}
        chainId={EthereumChainIds.Ropsten}
        complete={false}
      />
      {pageContent}
    </DefaultTemplate>
  );
};

export default Claim;
