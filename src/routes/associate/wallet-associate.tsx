import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";
import { AssociateInfo } from "./associate-info";
import { AssociateAction, AssociateState } from "./associate-reducer";
import React from "react";
import { AssociateInput } from "./associate-input";
import { useTransaction } from "../../hooks/use-transaction";
import { useVegaToken } from "../../hooks/use-vega-token";
import {
  TransactionActionType,
  TxState,
} from "../../hooks/transaction-reducer";
import { TransactionCallout } from "../../components/transaction-callout";

export const WalletAssociate = ({
  perform,
  state,
  dispatch,
  vegaKey,
  address,
}: {
  perform: () => void;
  state: AssociateState;
  dispatch: React.Dispatch<AssociateAction>;
  vegaKey: VegaKeyExtended;
  address: string;
}) => {
  const { amount } = state;
  const { t } = useTranslation();
  const {
    appDispatch,
    appState: { walletBalance, allowance, vegaStakedBalance },
  } = useAppState();
  const isApproved = !new BigNumber(allowance!).isEqualTo(0);
  const token = useVegaToken();
  const {
    state: approveState,
    perform: approve,
    dispatch: approveDispatch,
  } = useTransaction(() => token.approve(address));
  const maximum = React.useMemo(
    () =>
      BigNumber.min(new BigNumber(walletBalance), new BigNumber(allowance!)),
    [allowance, walletBalance]
  );
  const isDisabled = React.useMemo<boolean>(
    () =>
      !isApproved ||
      !amount ||
      new BigNumber(amount).isLessThanOrEqualTo("0") ||
      new BigNumber(amount).isGreaterThan(maximum),
    [amount, isApproved, maximum]
  );

  // Once they have approved deposits then we need to refresh their allowance
  React.useEffect(() => {
    const run = async () => {
      if (approveState.txState === TxState.Complete) {
        const allowance = await token.allowance(address);
        appDispatch({
          type: AppStateActionType.SET_ALLOWANCE,
          allowance,
        });
      }
    };
    run();
  }, [address, appDispatch, approveState.txState, token]);

  let pageContent = null;
  if (new BigNumber(walletBalance).isEqualTo("0")) {
    pageContent = (
      <div className="wallet-associate__error">
        {t(
          "You have no VEGA tokens in your connected wallet. You will need to buy some VEGA tokens from an exchange in order to stake using this method."
        )}
      </div>
    );
  } else if (
    new BigNumber(walletBalance).minus(vegaStakedBalance!).isEqualTo("0")
  ) {
    pageContent = (
      <div className="wallet-associate__error">
        {t(
          "All VEGA tokens in the connected wallet is already associated with a Vega wallet/key"
        )}
      </div>
    );
  } else if (
    approveState.txState !== TxState.Default &&
    approveState.txState !== TxState.Complete
  ) {
    pageContent = (
      <TransactionCallout
        state={approveState}
        reset={() => approveDispatch({ type: TransactionActionType.TX_RESET })}
      />
    );
  } else {
    pageContent = (
      <>
        <AssociateInfo pubKey={vegaKey.pub} />
        <AssociateInput state={state} maximum={maximum} dispatch={dispatch} />
        <button
          data-testid="approve-button"
          style={{ width: "100%" }}
          disabled={isApproved}
          onClick={approve}
        >
          {t("Approve VEGA tokens for staking on Vega")}
        </button>
        <button
          style={{ marginTop: 10, width: "100%" }}
          data-testid="associate-button"
          disabled={isDisabled}
          onClick={perform}
        >
          {t("Associate VEGA Tokens with key")}
        </button>
      </>
    );
  }

  return <section data-testid="wallet-associate">{pageContent}</section>;
};
