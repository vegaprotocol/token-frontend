import React from "react";
import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import {
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useSearchParams } from "../../hooks/use-search-params";
import { ClaimError } from "./claim-error";
import { claimReducer, ClaimStatus, initialClaimState } from "./claim-reducer";
import { ClaimFlow } from "./claim-flow";
import { ClaimRestricted } from "./claim-restricted";
import { isRestricted } from "./lib/is-restricted";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Web3Container } from "../../components/web3-container";
import { ClaimConnect } from "./claim-connect";
import { TrancheContainer } from "../../components/tranche-container";
import { WrongChain } from "../../components/wrong-chain";

const Claim = () => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const { appState, appDispatch } = useAppState();
  const vesting = useVegaVesting();
  const [state, dispatch] = React.useReducer(claimReducer, initialClaimState);

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
      vesting.getAllTranches().then((tranches) => {
        appDispatch({ type: "SET_TRANCHES", tranches });
      });
    }
  }, [vesting, state.claimStatus, appState.address, appDispatch]);

  let pageContent;

  if (isRestricted()) {
    pageContent = <ClaimRestricted />;
  } else if (
    appState.providerStatus === ProviderStatus.Ready &&
    appState.chainId !== appState.appChainId
  ) {
    pageContent = (
      <WrongChain
        currentChainId={appState.chainId!}
        desiredChainId={appState.appChainId}
      />
    );
  } else if (!appState.address) {
    pageContent = <ClaimConnect />;
  } else if (state.error) {
    pageContent = <ClaimError />;
  } else if (appState.address && state.code) {
    pageContent = <ClaimFlow state={state} dispatch={dispatch} />;
  }
  return (
    <Web3Container>
      <TrancheContainer>
        <DefaultTemplate title={t("pageTitleClaim")}>
          {pageContent}
        </DefaultTemplate>
      </TrancheContainer>
    </Web3Container>
  );
};

export default Claim;
