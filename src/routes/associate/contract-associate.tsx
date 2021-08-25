import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import React from "react";
import {
  useAppState,
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";
import { AssociateAction, AssociateState } from "./associate-reducer";
import { AssociateInfo } from "./associate-info";
import { AssociateInput } from "./associate-input";

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

  return (
    <section className="contract-associate" data-testid="contract-associate">
      <Callout>
        {t(
          "You can associate tokens while they are held in the vesting contract, when they unlock you will need to dissociate them before they can be redeemed."
        )}
      </Callout>
      <AssociateInfo pubKey={vegaKey.pub} />
      <AssociateInput maximum={maximum} state={state} dispatch={dispatch} />
      <button
        data-testid="associate-button"
        disabled={isDisabled}
        style={{ width: "100%" }}
        onClick={perform}
      >
        {t("Associate VEGA Tokens with key")}
      </button>
    </section>
  );
};
