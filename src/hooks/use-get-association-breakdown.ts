import * as Sentry from "@sentry/react";
import React from "react";

import {
  AppStateActionType,
  useAppState,
} from "../contexts/app-state/app-state-context";
import { IVegaStaking, IVegaVesting } from "../lib/web3-utils";

export function useGetAssociationBreakdown(
  ethAddress: string,
  staking: IVegaStaking,
  vesting: IVegaVesting
): () => Promise<void> {
  const { appDispatch } = useAppState();

  const getAssociationBreakdown = React.useCallback(async () => {
    try {
      const [stakingAssociations, vestingAssociations] = await Promise.all([
        staking.userTotalStakedByVegaKey(ethAddress),
        vesting.userTotalStakedByVegaKey(ethAddress),
      ]);

      appDispatch({
        type: AppStateActionType.SET_ASSOCIATION_BREAKDOWN,
        breakdown: {
          stakingAssociations,
          vestingAssociations,
        },
      });
    } catch (err) {
      Sentry.captureException(err);
    }
  }, [ethAddress, staking, vesting, appDispatch]);

  return getAssociationBreakdown;
}
