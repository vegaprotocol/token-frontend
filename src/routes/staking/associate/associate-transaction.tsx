import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TransactionCallout } from "../../../components/transaction-callout";
import { TransactionComplete } from "../../../components/transaction-callout/transaction-complete";
import { EthereumChainId } from "../../../config";
import {
  TransactionAction,
  TransactionActionType,
  TransactionState,
  TxState,
} from "../../../hooks/transaction-reducer";
import { truncateMiddle } from "../../../lib/truncate-middle";
import { Routes } from "../../router-config";
import { PartyStakeLinkings_party_stake_linkings } from "./__generated__/PartyStakeLinkings";

export const AssociateTransaction = ({
  amount,
  vegaKey,
  state,
  dispatch,
  requiredConfirmations,
  linking,
  chainId,
}: {
  amount: string;
  vegaKey: string;
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
  requiredConfirmations: number;
  linking: PartyStakeLinkings_party_stake_linkings | null;
  chainId: EthereumChainId;
}) => {
  const { t } = useTranslation();

  if (state.txState === TxState.Complete && linking) {
    return (
      <TransactionComplete
        hash={state.txData.hash!}
        chainId={chainId}
        heading={t("Done")}
        body={t(
          "Vega key {{vegaKey}} can now participate in governance and Nominate a validator with it’s stake.",
          { vegaKey: truncateMiddle(vegaKey) }
        )}
        footer={
          <Link to={Routes.STAKING}>
            <button className="fill">
              {t("Nominate Stake to Validator Node")}
            </button>
          </Link>
        }
      />
    );
  }

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
