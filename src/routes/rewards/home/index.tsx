import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Trans, useTranslation } from "react-i18next";
import { SplashLoader } from "../../../components/splash-loader";
import { SplashScreen } from "../../../components/splash-screen";
import { EpochCountdown } from "../../staking/epoch-countdown";
import { Epoch } from "./__generated__/Epoch";

export const EPOCH_QUERY = gql`
  query Epoch {
    epoch {
      id
      timestamps {
        start
        end
      }
    }
  }
`;

export const RewardsIndex = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery<Epoch>(EPOCH_QUERY);
  if (loading || !data?.epoch) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }
  console.log(data, loading, error);
  return (
    <section>
      <p>
        <Trans
          i18nKey="rewardsParagraph1"
          components={{
            strong: <strong />,
          }}
        />
      </p>
      <p>
        <Trans
          i18nKey="rewardsParagraph2"
          components={{
            strong: <strong />,
          }}
        />
      </p>
      <p>{t("rewardsParagraph3")}</p>
      {!loading &&
        !error &&
        data.epoch.timestamps.start &&
        data.epoch.timestamps.end && (
          <EpochCountdown
            containerClass="staking-node__epoch"
            id={data!.epoch.id}
            startDate={new Date(data.epoch.timestamps.start)}
            endDate={new Date(data.epoch.timestamps.end)}
          />
        )}
    </section>
  );
};
