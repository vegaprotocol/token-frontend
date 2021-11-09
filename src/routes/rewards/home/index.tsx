import "./index.scss";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";
import { SplashLoader } from "../../../components/splash-loader";
import { SplashScreen } from "../../../components/splash-screen";
import { Epoch } from "./__generated__/Epoch";
import { EpochCountdown } from "../../../components/epoch-countdown";
import { Rewards } from "./__generated__/Rewards";
import { useVegaUser } from "../../../hooks/use-vega-user";
import { RewardInfo } from "./reward-info";
import {
  AppStateActionType,
  useAppState,
} from "../../../contexts/app-state/app-state-context";
import { useNetworkParam } from "../../../hooks/use-network-param";
import { NetworkParams } from "../../../config";

export const EPOCH_QUERY = gql`
  query Epoch {
    epoch {
      id
      timestamps {
        start
        end
        expiry
      }
    }
  }
`;

export const REWARDS_QUERY = gql`
  query Rewards($partyId: ID!) {
    party(id: $partyId) {
      id
      rewardDetails {
        asset {
          id
          symbol
        }
        rewards {
          asset {
            id
            symbol
          }
          party {
            id
          }
          epoch {
            id
          }
          amount
          amountFormatted @client
          percentageOfTotal
          receivedAt
        }
        totalAmount
        totalAmountFormatted @client
      }
      delegations {
        amount
        amountFormatted @client
        epoch
      }
    }
  }
`;

export const RewardsIndex = () => {
  const { t } = useTranslation();
  const { currVegaKey } = useVegaUser();
  const { appDispatch } = useAppState();
  const { data, loading, error } = useQuery<Epoch>(EPOCH_QUERY);
  const {
    data: rewardsData,
    loading: rewardsLoading,
    error: rewardsError,
  } = useQuery<Rewards>(REWARDS_QUERY, {
    variables: { partyId: currVegaKey?.pub },
    skip: !currVegaKey?.pub,
  });
  const {
    data: rewardAssetData,
    loading: rewardAssetLoading,
    error: rewardAssetError,
  } = useNetworkParam([NetworkParams.REWARD_ASSET]);

  if (error || rewardsError || rewardAssetError) {
    return (
      <section>
        <p>Something went wrong</p>
        {error && <pre>{error.message}</pre>}
        {rewardsError && <pre>{rewardsError.message}</pre>}
        {rewardAssetError && <pre>{rewardAssetError.message}</pre>}
      </section>
    );
  }

  if (
    loading ||
    !data?.epoch ||
    rewardsLoading ||
    rewardAssetLoading ||
    !rewardAssetData?.length
  ) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <section className="rewards">
      <p>{t("rewardsPara1")}</p>
      <p>{t("rewardsPara2")}</p>
      <h2>{t("activeRewardsTitle")}</h2>
      <h3>{t("stakingTitle")}</h3>
      <p>{t("stakingPara", { amount: "TODO" })}</p>
      {!loading &&
        !error &&
        data.epoch.timestamps.start &&
        data.epoch.timestamps.expiry && (
          <EpochCountdown
            containerClass="staking-node__epoch"
            id={data!.epoch.id}
            startDate={new Date(data.epoch.timestamps.start)}
            endDate={new Date(data.epoch.timestamps.expiry!)}
          />
        )}
      <section>
        {currVegaKey ? (
          <RewardInfo currVegaKey={currVegaKey} data={rewardsData} />
        ) : (
          <button
            onClick={() =>
              appDispatch({
                type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
                isOpen: true,
              })
            }
          >
            Connect Vega key
          </button>
        )}
      </section>
    </section>
  );
};
