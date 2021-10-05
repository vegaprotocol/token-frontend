import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TransactionCallout } from "../../../components/transaction-callout";
import {
  TransactionAction,
  TransactionActionType,
  TransactionState,
  TxState,
} from "../../../hooks/transaction-reducer";
import { Routes } from "../../router-config";
import { PartyStakeLinkings_party_stake_linkings } from "./__generated__/PartyStakeLinkings";

export const AssociateTransaction = ({
  amount,
  vegaKey,
  state,
  dispatch,
  requiredConfirmations,
  linking,
}: {
  amount: string;
  vegaKey: string;
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
  requiredConfirmations: number;
  linking: PartyStakeLinkings_party_stake_linkings | null;
}) => {
  const { t } = useTranslation();

  let derivedTxState: TxState = state.txState;

  if (state.txState === TxState.Complete && !linking) {
    derivedTxState = TxState.Pending;
  }

  return (
    <TransactionCallout
      completeHeading={t("Done")}
      completeBody={t(
        "Vega key {{vegaKey}} can now participate in governance and Nominate a validator with it’s stake.",
        { vegaKey }
      )}
      completeFooter={
        <Link to={Routes.STAKING}>
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
      state={{
        ...state,
        txState: derivedTxState,
      }}
      reset={() => dispatch({ type: TransactionActionType.TX_RESET })}
    />
  );
};
