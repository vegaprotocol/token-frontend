import { useTranslation } from "react-i18next";
import { Heading } from "../../../components/heading";
import { SplashLoader } from "../../../components/splash-loader";
import { SplashScreen } from "../../../components/splash-screen";
import { TokenInput } from "../../../components/token-input";
import { NetworkParams } from "../../../config";
import { useNetworkParam } from "../../../hooks/use-network-param";

export const WithdrawContainer = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useNetworkParam([
    NetworkParams.REWARD_ASSET,
  ]);

  if (error) {
    return (
      <section>
        <p>{t("Something went wrong")}</p>
        <pre>{error.message}</pre>
      </section>
    );
  }

  if (loading || !data) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return <Withdraw rewardAssetId={data[0]} />;
};

interface WithdrawProps {
  rewardAssetId: string;
}

export const Withdraw = ({ rewardAssetId }: WithdrawProps) => {
  return (
    <section>
      <Heading title="Withdraw rewards" />
      <p>
        Staking rewards are paid into a Vega wallet. They can be withdrawn using
        the VEGA-ERC20 bridge.
      </p>
      <h3>What would you like to withdraw</h3>
      <select>
        <option></option>
      </select>
      <h3>How much would you like to withdraw?</h3>
      {/* <TokenInput /> */}
    </section>
  );
};
