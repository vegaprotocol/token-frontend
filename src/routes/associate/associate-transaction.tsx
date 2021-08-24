import { useTranslation } from "react-i18next";
import { TransactionCallout } from "../../components/transaction-callout";
import {
  TransactionAction,
  TransactionActionType,
  TransactionState,
} from "../../hooks/transaction-reducer";

export const AssociateTransaction = ({
  amount,
  vegaKey,
  state,
  dispatch,
}: {
  amount: string;
  vegaKey: string;
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
}) => {
  const { t } = useTranslation();
  return (
    <TransactionCallout
      completeHeading={t("Done")}
      completeBody={t(
        "Vega key {{vegaKey}} can now participate in governance and Nominate a validator with it’s stake.",
        { vegaKey }
      )}
      completeFooter={
        <button style={{ width: "100%" }}>
          {t("Nominate Stake to Validator Node")}
        </button>
      }
      pendingHeading={t("Associating Tokens")}
      pendingBody={t(
        "Associating {{amount}} VEGA tokens with Vega key {{vegaKey}}",
        { amount, vegaKey }
      )}
      pendingFooter={t(
        "The Vega network requires 30 Confirmations (approx 5 minutes) on Ethereum before crediting your Vega key with your tokens. This page will update once complete or you can come back and check your Vega wallet to see if it is ready to use."
      )}
      state={state}
      reset={() => dispatch({ type: TransactionActionType.TX_RESET })}
    />
  );
};
