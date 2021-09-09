import React from "react";
import { useEthUser } from "../../../hooks/use-eth-user";
import { useVegaLPStaking } from "../../../hooks/use-vega-lp-staking";
import { BigNumber } from "../../../lib/bignumber";
import { useParams } from "react-router";
import { REWARDS_ADDRESSES } from "../../../config";
import { TokenInput } from "../../../components/token-input";
import { useTranslation } from "react-i18next";

export const LiquidityWithdrawPage = ({
  lpTokenAddress,
}: {
  lpTokenAddress: string;
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState("0");
  const lpStaking = useVegaLPStaking({ address: lpTokenAddress });
  const { ethAddress } = useEthUser();
  return (
    <section>
      <TokenInput
        submitText={t("Withdraw {{address}}", { address: lpTokenAddress })}
        perform={() => undefined}
        amount={amount}
        setAmount={setAmount}
        maximum={new BigNumber(100)}
      />
    </section>
  );
};

export const LiquidityWithdraw = () => {
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
  return <LiquidityWithdrawPage lpTokenAddress={address} />;
};
