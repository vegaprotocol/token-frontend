import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { TransactionCallout } from "../../../components/transaction-callout";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TxState } from "../../../hooks/transaction-reducer";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaVesting } from "../../../hooks/use-vega-vesting";
import { RedemptionState } from "../redemption-reducer";
import { TrancheTable } from "../tranche-table";

export const RedeemFromTranche = ({ state }: { state: RedemptionState }) => {
  const vesting = useVegaVesting();
  const { t } = useTranslation();
  const {
    appState: { address },
  } = useAppState();
  const { id } = useParams<{ id: string }>();
  const numberId = Number(id);
  const { balances, userTranches, lien } = state;
  const tranche = userTranches.find(
    ({ tranche_id }) => tranche_id === numberId
  );
  const {
    state: txState,
    perform,
    dispatch: txDispatch,
  } = useTransaction(
    () => vesting.withdrawFromTranche(address!, numberId),
    () => vesting.checkWithdrawFromTranche(address!, numberId)
  );

  if (!tranche) {
    return (
      <section data-testid="redemption-page">
        <div data-testid="redemption-no-balance">
          {t(
            "You do not have any vesting VEGA tokens. Switch to another Ethereum key to check what can be redeemed."
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="redemption-tranche" data-testid="redemption-tranche">
      {txState.txState !== TxState.Default ? (
        <TransactionCallout
          state={txState}
          reset={() => txDispatch({ type: "TX_RESET" })}
        />
      ) : (
        <TrancheTable
          tranche={tranche}
          lien={lien}
          locked={
            balances.find(({ id: bId }) => bId.toString() === id.toString())!
              .locked
          }
          vested={
            balances.find(({ id: bId }) => bId.toString() === id.toString())!
              .vested
          }
          onClick={perform}
        />
      )}
    </section>
  );
};
