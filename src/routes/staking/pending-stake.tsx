import "./pending-stake.scss";

import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";

import { useAppState } from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";
import { removeDecimal } from "../../lib/decimals";
import {
  UndelegateSubmissionInput,
  vegaWalletService,
} from "../../lib/vega-wallet/vega-wallet-service";

interface PendingStakeProps {
  pendingAmount: BigNumber;
  nodeId: string;
  pubkey: string;
}

export const PendingStake = ({
  pendingAmount,
  nodeId,
  pubkey
}: PendingStakeProps) => {
  const { t } = useTranslation();
  const { appState } = useAppState();

  const removeStakeNow = async () => {
    // setFormState(FormState.Pending);
    const undelegateInput: UndelegateSubmissionInput = {
      pubKey: pubkey,
      undelegateSubmission: {
        nodeId,
        amount: removeDecimal(new BigNumber(pendingAmount), appState.decimals),
        method: "METHOD_NOW",
      },
    };

    try {
      const command = undelegateInput;
      const [err] = await vegaWalletService.commandSync(command);

      if (err) {
        // setFormState(FormState.Failure);
        Sentry.captureException(err);
      }
    } catch (err) {
      // setFormState(FormState.Failure);
      Sentry.captureException(err);
    }
  };

  return (
    <div className="your-stake__container">
      <h2>{t("pendingNomination")}</h2>
      <p>{t("pendingNominationNextEpoch", { pendingAmount })}</p>
      <button
        type="button"
        className="button-secondary button-secondary--dark"
        onClick={() => removeStakeNow()}
      >
        {t("cancelPendingEpochNomination")}
      </button>
    </div>
  );
};
