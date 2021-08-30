import "./token-input.scss";
import { FormGroup, InputGroup, Intent, Tag } from "@blueprintjs/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { BigNumber } from "../../lib/bignumber";

const inputName = "amount";

export const TokenInput = ({
  maximum,
  amount,
  setAmount,
}: {
  maximum: BigNumber;
  amount: string;
  setAmount: React.Dispatch<any>;
}) => {
  const { t } = useTranslation();
  return (
    <FormGroup label="" labelFor={inputName}>
      <div style={{ display: "flex" }}>
        <InputGroup
          data-testid="token-amount-input"
          className="token-input__input"
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
          data-testid="token-amount-use-maximum"
          className="button-link token-input__use-maximum "
        >
          {t("Use maximum")}
        </button>
      </div>
    </FormGroup>
  );
};
