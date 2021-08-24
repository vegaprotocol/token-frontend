import "./contract-associate.scss";
import { Button, FormGroup, InputGroup, Intent, Tag } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";
import { Callout } from "../../components/callout";
import React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";
import {
  AssociateAction,
  AssociateActionType,
  AssociateState,
} from "./associate-reducer";

const inputName = "amount";

export const ContractAssociate = ({
  perform,
  state,
  dispatch,
}: {
  perform: () => void;
  state: AssociateState;
  dispatch: React.Dispatch<AssociateAction>;
}) => {
  const { amount, stakedBalance } = state;
  const { t } = useTranslation();
  const setAmount = React.useCallback(
    (value: string) => {
      dispatch({ type: AssociateActionType.SET_AMOUNT, amount: value });
    },
    [dispatch]
  );
  const {
    appState: { currVegaKey, balanceFormatted },
  } = useAppState();

  const maximum = React.useMemo(() => {
    return new BigNumber(balanceFormatted).minus(stakedBalance!).toString();
  }, [balanceFormatted, stakedBalance]);

  console.log(
    maximum.toString(),
    // balanceFormatted.toString(),
    stakedBalance.toString()
  );
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
      <h2 data-testid="associate-vega-key-header">
        {t("What Vega wallet/key is going to control your stake?")}
      </h2>
      <strong
        data-testid="associate-vega-key-label"
        style={{ color: Colors.WHITE }}
      >
        {t("Connected Vega key")}
      </strong>
      <p style={{ color: Colors.WHITE }} data-testid="associate-vega-key">
        {currVegaKey?.pub}
      </p>
      <h2 data-testid="associate-amount-header">
        {t("How much would you like to associate?")}
      </h2>
      <FormGroup label="" labelFor={inputName}>
        <div style={{ display: "flex" }}>
          <InputGroup
            data-testid="associate-amount-input"
            className="contract-associate__input"
            name={inputName}
            id={inputName}
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            intent={Intent.NONE}
            rightElement={<Tag minimal={true}>{t("VEGA Tokens")}</Tag>}
            autoComplete="off"
            type="number"
          />
          <button
            onClick={() => setAmount(maximum)}
            data-testid="associate-amount-use-maximum"
            className="button-link contract-associate__use-maximum "
          >
            {t("Use maximum")}
          </button>
        </div>
      </FormGroup>
      <Button
        data-testid="associate-button"
        fill={true}
        disabled={isDisabled}
        onClick={perform}
      >
        {t("Associate VEGA Tokens with key")}
      </Button>
    </section>
  );
};
