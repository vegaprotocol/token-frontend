import React from "react";
import { useEthUser } from "../../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../../hooks/use-vega-lp-staking";
import { BigNumber } from "../../../lib/bignumber";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router";
import { REWARDS_ADDRESSES } from "../../../config";

export const LiquidityDepositPage = ({
  lpTokenAddress,
}: {
  lpTokenAddress: string;
}) => {
  const lpStaking = useVegaLPStaking({ address: lpTokenAddress });
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

export const LiquidityDeposit = () => {
  const { address } = useParams<{ address: string }>();

  const isValidAddress = React.useMemo(
    () => Object.values(REWARDS_ADDRESSES).includes(address),
    [address]
  );

  if (!isValidAddress) {
    return (
      <section>
        Address {address} is not a valid LP token address for VEGA
      </section>
    );
  }
  return <LiquidityDepositPage lpTokenAddress={address} />;
};
