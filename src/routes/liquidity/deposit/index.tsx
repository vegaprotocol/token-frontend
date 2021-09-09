import React from "react";
import { useEthUser } from "../../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../../hooks/use-vega-lp-staking";
import { BigNumber } from "../../../lib/bignumber";
import * as Sentry from "@sentry/react";

export const LiquidityDeposit = () => {
  const contractAddress = "0xf3153577008864d23805Dd0912340AF5604bb544";
  const lpStaking = useVegaLPStaking({ address: contractAddress });
  const [approvedAmount, setApprovedAmount] = React.useState<BigNumber>(
    new BigNumber("0")
  );
  const { ethAddress } = useEthUser();
  const hasApproved = React.useMemo(
    () => !approvedAmount.isEqualTo(0),
    [approvedAmount]
  );
  React.useEffect(() => {
    const run = async () => {
      try {
        const allowance = await lpStaking.allowance(ethAddress);
        setApprovedAmount(new BigNumber(allowance));
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    run();
  }, [lpStaking, ethAddress]);
  return <section>Deposit</section>;
};
