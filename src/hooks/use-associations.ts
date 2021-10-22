import React from "react";
import * as Sentry from "@sentry/react";
import { BigNumber } from "../lib/bignumber";
import { useContracts } from "../contexts/contracts/contracts-context";
import mergeWith from "lodash/mergeWith";

export function useAssociations(ethAddress?: string): {
  associations: {
    [vegaKey: string]: BigNumber;
  };
  refetch: () => void;
} {
  const { vesting, staking } = useContracts();
  const [associations, setAssociations] = React.useState({});

  const fetchAssociations = React.useCallback(async () => {
    if (!ethAddress) return;

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

      setAssociations(result);
    } catch (err) {
      Sentry.captureException(err);
    }
  }, [staking, vesting, ethAddress]);

  React.useEffect(() => {
    fetchAssociations();
  }, [fetchAssociations]);

  return { associations, refetch: fetchAssociations };
}
