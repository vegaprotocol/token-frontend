import React from "react";
import * as Sentry from "@sentry/react";
import {
  vegaWalletService,
  WithdrawSubmissionInput,
} from "../lib/vega-wallet/vega-wallet-service";

export const useCreateWithdrawal = () => {
  return React.useCallback(
    async (
      pubKey: string,
      amount: string,
      asset: string,
      receiverAddress: string
    ) => {
      const command: WithdrawSubmissionInput = {
        pubKey,
        withdrawSubmission: {
          amount,
          asset,
          ext: {
            erc20: {
              receiverAddress,
            },
          },
        },
      };
      try {
        const [err] = await vegaWalletService.commandSync(command);

        if (err) {
          // do something
        }
      } catch (err) {
        Sentry.captureException(err);
      }
    },
    []
  );
};
