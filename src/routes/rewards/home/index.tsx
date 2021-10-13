import "./index.scss";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Trans, useTranslation } from "react-i18next";
import { SplashLoader } from "../../../components/splash-loader";
import { SplashScreen } from "../../../components/splash-screen";
import { Epoch } from "./__generated__/Epoch";
import { EpochCountdown } from "../../../components/epoch-countdown";
import { Rewards } from "./__generated__/Rewards";
import { useVegaUser } from "../../../hooks/use-vega-user";
import { Colors } from "../../../config";

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
      rewardDetails {
        asset {
          id
          symbol
        }
        rewards {
          assetId
          partyId
          epoch
          amount
          percentageOfTotal
          receivedAt
        }
        totalAmount
      }
    }
  }
`;

export const RewardsIndex = () => {
  const { t } = useTranslation();
  const { currVegaKey } = useVegaUser();
  const { data, loading, error } = useQuery<Epoch>(EPOCH_QUERY);
  const {
    data: rewardsData,
    loading: rewardsLoading,
    error: rewardsError,
  } = useQuery<Rewards>(REWARDS_QUERY, {
    variables: { partyId: currVegaKey?.pub },
    skip: !currVegaKey?.pub,
  });
  if (loading || !data?.epoch || rewardsLoading) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }
  console.log(rewardsData, data!.epoch);
  return (
    <section className="rewards">
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
        data.epoch.timestamps.expiry && (
          <EpochCountdown
            containerClass="staking-node__epoch"
            id={data!.epoch.id}
            startDate={new Date(data.epoch.timestamps.start)}
            endDate={new Date(data.epoch.timestamps.expiry!)}
          />
        )}
      <h3>Recent epochs</h3>
      <p>
        Total rewards:{" "}
        {rewardsData?.party?.rewardDetails &&
          rewardsData.party.rewardDetails[0]?.totalAmount}
      </p>
      <table style={{ textAlign: "left", width: "100%", color: Colors.WHITE }}>
        <thead>
          <tr>
            <th>
              <div>Epoch number</div>
              <div className="text-deemphasise">Epoch end</div>
            </th>
            <th>You score based share %</th>
            <th>
              <div>Total (Fees + Reward)</div>
              <select>
                <option>VEGA tokens</option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* TODO find reward selected from asset list */}
          {rewardsData?.party?.rewardDetails &&
            rewardsData?.party?.rewardDetails[0]?.rewards &&
            rewardsData.party.rewardDetails[0]?.rewards.map((r) => (
              <tr>
                <td>
                  <div>{r?.epoch}</div>
                  <div className="text-deemphasise">17 Sept 2021 23:59</div>
                </td>
                <td style={{ textAlign: "right" }}>{r?.percentageOfTotal}</td>
                <td style={{ textAlign: "right" }}>{r?.amount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};
