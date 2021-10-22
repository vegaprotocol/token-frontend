import React from "react";
import * as Sentry from "@sentry/react";
import { BigNumber } from "../lib/bignumber";
import mergeWith from "lodash/mergeWith";
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

      // Merge associations via vesting and wallet, adding the values together
      // if both types of association have been used for a single Vega key
      const result = mergeWith(
        stakingAssociations,
        vestingAssociations,
        (obj: BigNumber, src: BigNumber) => {
          if (!obj) return src;
          if (!src) return obj;
          return obj.plus(src);
        }
      );

      appDispatch({
        type: AppStateActionType.SET_ASSOCIATION_BREAKDOWN,
        breakdown: result,
      });
    } catch (err) {
      Sentry.captureException(err);
    }
  }, [ethAddress, staking, vesting, appDispatch]);

  return getAssociationBreakdown;
}
