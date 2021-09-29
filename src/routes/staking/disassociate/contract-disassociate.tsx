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
    appState: { lien },
  } = useAppState();
  const { t } = useTranslation();
  const maximum = React.useMemo(
    () => new BigNumber(lien!),
    [lien]
  );
  if (new BigNumber(lien!).isEqualTo("0")) {
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
      <TokenInput
        submitText={t("Disassociate VEGA Tokens from key")}
        perform={perform}
        maximum={maximum}
        amount={amount}
        setAmount={setAmount}
        currency={t("VEGA Tokens")}
      />
    </>
  );
};
