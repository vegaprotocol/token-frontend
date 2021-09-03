import "./index.scss";
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
        data.epoch.timestamps.end && (
          <EpochCountdown
            containerClass="staking-node__epoch"
            id={data!.epoch.id}
            startDate={new Date(data.epoch.timestamps.start)}
            endDate={new Date(data.epoch.timestamps.end)}
          />
        )}
      <h3>Recent epochs</h3>
      <table style={{ textAlign: "left", width: "100%" }}>
        <thead>
          <tr>
            <th>
              <div>Epoch number</div>
              <div>Epoch end</div>
            </th>
            <th>You score based share %</th>
            <th>
              <div>Total (Fees+Reward)</div>
              <select>
                <option>VEGA tokens</option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>-</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
          <tr>
            <td>
              <div>14 - Current</div>
              <div>17 Sept 2021 23:59</div>
            </td>
            <td style={{ textAlign: "right" }}>0.09</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
