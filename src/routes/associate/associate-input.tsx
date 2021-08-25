import "./associate-input.scss";
import { FormGroup, InputGroup, Intent, Tag } from "@blueprintjs/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { BigNumber } from "../../lib/bignumber";
import {
  AssociateAction,
  AssociateActionType,
  AssociateState,
} from "./associate-reducer";

const inputName = "amount";

export const AssociateInput = ({
  maximum,
  state,
  dispatch,
}: {
  maximum: BigNumber;
  state: AssociateState;
  dispatch: React.Dispatch<AssociateAction>;
}) => {
  const { amount } = state;
  const setAmount = React.useCallback(
    (value: string) => {
      dispatch({ type: AssociateActionType.SET_AMOUNT, amount: value });
    },
    [dispatch]
  );
  const { t } = useTranslation();
  return (
    <FormGroup label="" labelFor={inputName}>
      <div style={{ display: "flex" }}>
        <InputGroup
          data-testid="associate-amount-input"
          className="associate-input__input"
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
          onClick={() => setAmount(maximum.toString())}
          data-testid="associate-amount-use-maximum"
          className="button-link associate-input__use-maximum "
        >
          {t("Use maximum")}
        </button>
      </div>
    </FormGroup>
  );
};
