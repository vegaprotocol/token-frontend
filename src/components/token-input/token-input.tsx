import "./token-input.scss";
import { FormGroup, InputGroup, Intent, Tag } from "@blueprintjs/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { BigNumber } from "../../lib/bignumber";
import { Callout } from "../callout";
import { Tick } from "../icons";

const inputName = "amount";

export const TokenInput = ({
  amount,
  setAmount,
  perform,
  submitText,

  approveText,
  allowance,
  approve,
  requireApproval = false,
  maximum = new BigNumber("0"),
}: {
  amount: string;
  setAmount: React.Dispatch<any>;
  perform: () => void;
  requireApproval?: boolean;
  submitText: string;

  maximum?: BigNumber;
  allowance?: BigNumber;
  approve?: () => void;
  approveText?: string;
}) => {
  if (requireApproval && (allowance == null || approve == null)) {
    throw new Error(
      "If requires approval is true allowance and approve props are required!"
    );
  }
  const { t } = useTranslation();
  const isApproved = !new BigNumber(allowance!).isEqualTo(0);
  const isDisabled = React.useMemo<boolean>(() => {
    if (requireApproval) {
      return (
        !isApproved ||
        !amount ||
        new BigNumber(amount).isLessThanOrEqualTo("0") ||
        new BigNumber(amount).isGreaterThan(maximum)
      );
    }
    return (
      !amount ||
      new BigNumber(amount).isLessThanOrEqualTo("0") ||
      new BigNumber(amount).isGreaterThan(maximum)
    );
  }, [amount, isApproved, maximum, requireApproval]);
  return (
    <FormGroup label="" labelFor={inputName}>
      <div className="token-input__container">
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
          max={maximum.toNumber()}
          min={0}
        />
        {maximum && (
          <button
            type="button"
            onClick={() => setAmount(maximum.toString())}
            data-testid="token-amount-use-maximum"
            className="button-link token-input__use-maximum "
          >
            {t("Use maximum")}
          </button>
        )}
      </div>
      {isApproved ? (
        <div className="token-input__callout-container">
          <Callout
            icon={<Tick />}
            intent="success"
            title={t("VEGA tokens are approved for staking")}
          ></Callout>
        </div>
      ) : (
        <button
          data-testid="token-input-approve-button"
          className="fill token-input__submit"
          onClick={approve}
        >
          {approveText}
        </button>
      )}
      <button
        data-testid="token-input-submit-button"
        className="fill token-input__submit"
        disabled={isDisabled}
        onClick={perform}
      >
        {submitText}
      </button>
    </FormGroup>
  );
};
