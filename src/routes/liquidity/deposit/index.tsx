import React from "react";
import { useEthUser } from "../../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../../hooks/use-vega-lp-staking";
import { BigNumber } from "../../../lib/bignumber";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router";
import { REWARDS_ADDRESSES } from "../../../config";
import { TokenInput } from "../../../components/token-input";
import { useTranslation } from "react-i18next";

export const LiquidityDepositPage = ({
  lpTokenAddress,
}: {
  lpTokenAddress: string;
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState("0");
  const lpStaking = useVegaLPStaking({ address: lpTokenAddress });
  const [allowance, setAllowance] = React.useState<BigNumber>(
    new BigNumber("0")
  );
  const { ethAddress } = useEthUser();
  React.useEffect(() => {
    const run = async () => {
      try {
        const allowance = await lpStaking.allowance(ethAddress);
        setAllowance(new BigNumber(allowance));
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    run();
  }, [lpStaking, ethAddress]);
  return (
    <section>
      <TokenInput
        submitText={t("Deposit {{address}}", { address: lpTokenAddress })}
        approveText={t("Approve deposits of {{address}}", {
          address: lpTokenAddress,
        })}
        requireApproval={true}
        allowance={allowance}
        perform={() => undefined}
        approve={() => undefined}
        amount={amount}
        setAmount={setAmount}
        maximum={new BigNumber(100)}
      />
    </section>
  );
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
