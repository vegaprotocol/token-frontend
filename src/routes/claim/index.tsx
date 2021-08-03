import React from "react";
import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import { TransactionConfirm } from "../../components/transaction-confirm";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useConnect } from "../../hooks/use-connect";
import { useSearchParams } from "../../hooks/use-search-params";
import { ClaimError } from "./claim-error";
import { claimReducer, ClaimStatus, initialClaimState } from "./claim-reducer";
import { ConnectedClaim } from "./connected";
import { ClaimRestricted } from "./claim-restricted";
import { isRestricted } from "./lib/is-restricted";
import { useVegaVesting } from "../../hooks/use-vega-vesting";

const ClaimRouter = () => {
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
    pageContent = <ConnectedClaim state={state} dispatch={dispatch} />;
  } else if (!appState.address) {
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
