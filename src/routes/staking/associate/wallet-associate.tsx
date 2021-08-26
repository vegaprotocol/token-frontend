import "./wallet-associate.scss";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
} from "../../../contexts/app-state/app-state-context";
import { BigNumber } from "../../../lib/bignumber";
import { AssociateInfo } from "./associate-info";
import {
  AssociateAction,
  AssociateActionType,
  AssociateState,
} from "./associate-reducer";
import React from "react";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaToken } from "../../../hooks/use-vega-token";
import {
  TransactionActionType,
  TxState,
} from "../../../hooks/transaction-reducer";
import { TransactionCallout } from "../../../components/transaction-callout";
import { TokenInput } from "../../../components/token-input";

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
    appState: {
      walletBalance,
      allowance,
      vegaAssociatedBalance,
      contractAddresses,
    },
  } = useAppState();
  const isApproved = !new BigNumber(allowance!).isEqualTo(0);
  const token = useVegaToken();
  const {
    state: approveState,
    perform: approve,
    dispatch: approveDispatch,
  } = useTransaction(() =>
    token.approve(address, contractAddresses.stakingBridge)
  );
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

  const setAmount = React.useCallback(
    (value: string) => {
      dispatch({ type: AssociateActionType.SET_AMOUNT, amount: value });
    },
    [dispatch]
  );

  // Once they have approved deposits then we need to refresh their allowance
  React.useEffect(() => {
    const run = async () => {
      if (approveState.txState === TxState.Complete) {
        const allowance = await token.allowance(
          address,
          contractAddresses.stakingBridge
        );
        appDispatch({
          type: AppStateActionType.SET_ALLOWANCE,
          allowance,
        });
      }
    };
    run();
  }, [
    address,
    appDispatch,
    approveState.txState,
    contractAddresses.stakingBridge,
    token,
  ]);

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
    new BigNumber(walletBalance).minus(vegaAssociatedBalance!).isEqualTo("0")
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
      <>
        <AssociateInfo pubKey={vegaKey.pub} />
        <TokenInput maximum={maximum} amount={amount} setAmount={setAmount} />
        <TransactionCallout
          state={approveState}
          reset={() =>
            approveDispatch({ type: TransactionActionType.TX_RESET })
          }
        />
      </>
    );
  } else {
    pageContent = (
      <>
        <AssociateInfo pubKey={vegaKey.pub} />
        <TokenInput maximum={maximum} amount={amount} setAmount={setAmount} />
        {isApproved ? (
          t("VEGA tokens are approved for staking")
        ) : (
          <button
            data-testid="approve-button"
            style={{ width: "100%" }}
            onClick={approve}
          >
            {t("Approve VEGA tokens for staking on Vega")}
          </button>
        )}
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
