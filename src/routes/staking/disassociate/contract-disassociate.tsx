import React from "react";
import { useTranslation } from "react-i18next";
import { TokenInput } from "../../../components/token-input";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { BigNumber } from "../../../lib/bignumber";

export const ContractDisassociate = ({
  perform,
  amount,
  setAmount,
}: {
  perform: () => void;
  amount: string;
  setAmount: React.Dispatch<string>;
}) => {
  const {
    appState: { vestingAssociatedBalance },
  } = useAppState();
  const { t } = useTranslation();
  const maximum = React.useMemo(
    () => new BigNumber(vestingAssociatedBalance!),
    [vestingAssociatedBalance]
  );
  const isDisabled = React.useMemo<boolean>(
    () =>
      !amount ||
      new BigNumber(amount).isLessThanOrEqualTo("0") ||
      new BigNumber(amount).isGreaterThan(maximum),
    [amount, maximum]
  );
  if (new BigNumber(vestingAssociatedBalance!).isEqualTo("0")) {
    return (
      <div className="disassociate-page__error">
        {t(
          "You have no VEGA tokens currently staked through your connected Eth wallet."
        )}
      </div>
    );
  }
  return (
    <>
      <TokenInput maximum={maximum} amount={amount} setAmount={setAmount} />
      <button
        style={{ marginTop: 10, width: "100%" }}
        data-testid="disassociate-button"
        disabled={isDisabled}
        onClick={perform}
      >
        {t("Disassociate VEGA Tokens from key")}
      </button>
    </>
  );
};
