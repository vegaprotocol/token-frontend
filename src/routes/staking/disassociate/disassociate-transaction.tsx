import React from "react";
import { useTranslation } from "react-i18next";
import { StakingMethod } from "../../../components/staking-method-radio";
import {
  TransactionAction,
  TransactionActionType,
  TransactionState,
} from "../../../hooks/transaction-reducer";
import { TransactionCallout } from "../../../components/transaction-callout";
import { useHistory } from "react-router-dom";

export const DisassociateTransaction = ({
  amount,
  vegaKey,
  state,
  dispatch,
  stakingMethod,
}: {
  amount: string;
  vegaKey: string;
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
  stakingMethod: StakingMethod;
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <TransactionCallout
      completeHeading={t("Done")}
      completeBody={
        stakingMethod === StakingMethod.Contract
          ? t("{{amount}} VEGA tokens have been returned to Vesting contract", {
              amount,
            })
          : t("{{amount}} VEGA tokens have been returned to Ethereum wallet", {
              amount,
            })
      }
      completeFooter={
        <button
          style={{ width: "100%" }}
          onClick={() => history.push("/vesting")}
        >
          {t("Redeem tokens")}
        </button>
      }
      pendingHeading={t("Dissociating Tokens")}
      pendingBody={t(
        "Dissociating  {{amount}} VEGA tokens from Vega key {{vegaKey}}",
        { amount, vegaKey }
      )}
      state={state}
      reset={() => dispatch({ type: TransactionActionType.TX_RESET })}
    />
  );
};
