import "./contract-associate.scss";
import { useTranslation } from "react-i18next";
import { Callout } from "../../../components/callout";
import React from "react";
import {
  useAppState,
  VegaKeyExtended,
} from "../../../contexts/app-state/app-state-context";
import { BigNumber } from "../../../lib/bignumber";
import {
  AssociateAction,
  AssociateActionType,
  AssociateState,
} from "./associate-reducer";
import { AssociateInfo } from "./associate-info";
import { TokenInput } from "../../../components/token-input";

export const ContractAssociate = ({
  perform,
  state,
  dispatch,
  vegaKey,
}: {
  perform: () => void;
  state: AssociateState;
  dispatch: React.Dispatch<AssociateAction>;
  vegaKey: VegaKeyExtended;
}) => {
  const { amount } = state;
  const { t } = useTranslation();
  const {
    appState: { balanceFormatted, lien },
  } = useAppState();
  const setAmount = React.useCallback(
    (value: string) => {
      dispatch({ type: AssociateActionType.SET_AMOUNT, amount: value });
    },
    [dispatch]
  );

  const maximum = React.useMemo(() => {
    return new BigNumber(balanceFormatted).minus(lien!);
  }, [balanceFormatted, lien]);
  const isDisabled = React.useMemo<boolean>(
    () =>
      !amount ||
      new BigNumber(amount).isLessThanOrEqualTo("0") ||
      new BigNumber(amount).isGreaterThan(maximum),
    [amount, maximum]
  );

  let pageContent = null;
  if (new BigNumber(balanceFormatted).isEqualTo("0")) {
    pageContent = (
      <div className="contract-associate__error">
        {t("You have no VEGA tokens currently vesting.")}
      </div>
    );
  } else if (new BigNumber(balanceFormatted).minus(lien).isEqualTo("0")) {
    pageContent = (
      <div className="contract-associate__error">
        {t(
          "All VEGA tokens vesting in the connected wallet have already been staked."
        )}
      </div>
    );
  } else {
    pageContent = (
      <>
        <Callout>
          {t(
            "You can associate tokens while they are held in the vesting contract, when they unlock you will need to dissociate them before they can be redeemed."
          )}
        </Callout>
        <AssociateInfo pubKey={vegaKey.pub} />
        <TokenInput maximum={maximum} amount={amount} setAmount={setAmount} />
        <button
          data-testid="associate-button"
          disabled={isDisabled}
          style={{ width: "100%" }}
          onClick={perform}
        >
          {t("Associate VEGA Tokens with key")}
        </button>
      </>
    );
  }

  return (
    <section className="contract-associate" data-testid="contract-associate">
      {pageContent}
    </section>
  );
};
