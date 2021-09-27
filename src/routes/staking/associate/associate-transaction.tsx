import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TransactionCallout } from "../../../components/transaction-callout";
import {
  TransactionAction,
  TransactionActionType,
  TransactionState,
} from "../../../hooks/transaction-reducer";

export const AssociateTransaction = ({
  amount,
  vegaKey,
  state,
  dispatch,
  requiredConfirmations,
}: {
  amount: string;
  vegaKey: string;
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
  requiredConfirmations: number;
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
        <Link to="/staking">
          <button className="fill">
            {t("Nominate Stake to Validator Node")}
          </button>
        </Link>
      }
      pendingHeading={t("Associating Tokens")}
      pendingBody={t(
        "Associating {{amount}} VEGA tokens with Vega key {{vegaKey}}",
        { amount, vegaKey }
      )}
      pendingFooter={t("pendingAssociationText", {
        confirmations: requiredConfirmations,
      })}
      state={state}
      reset={() => dispatch({ type: TransactionActionType.TX_RESET })}
    />
  );
};
