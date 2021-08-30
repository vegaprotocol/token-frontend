import "./staking-node.scss";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ValidatorTable } from "./validator-table";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { EpochCountdown } from "./epoch-countdown";
import { YourStake } from "./your-stake";
import { StakingForm } from "./staking-form";
import { gql, useQuery } from "@apollo/client";
import { Node, NodeVariables } from "./__generated__/Node";
import { Callout } from "../../components/callout";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";

const NODE_QUERY = gql`
  query Node($nodeId: String!) {
    node(id: $nodeId) {
      id
      pubkey
      infoUrl
      location
      stakedByOperator
      stakedByDelegates
      stakedTotal
      pendingStake
      epochData {
        total
        offline
        online
      }
      status
    }
    epoch {
      id
      timestamps {
        start
        end
      }
    }
  }
`;

interface StakingNodeProps {
  vegaKey: VegaKeyExtended;
}

export const StakingNode = ({ vegaKey }: StakingNodeProps) => {
  const { node } = useParams<{ node: string }>();
  const { t } = useTranslation();
  const { data, loading, error } = useQuery<Node, NodeVariables>(NODE_QUERY, {
    variables: { nodeId: node },
    skip: !node,
  });

  if (error) {
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <p>Query for node {node} failed.</p>
        <pre>{error.message}</pre>
      </Callout>
    );
  }

  if (loading || !data) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return (
    <>
      <h2>{t("VALIDATOR {{node}}", { node })}</h2>
      <p>Vega key: {vegaKey.pubShort}</p>
      <ValidatorTable node={node} />
      {data.epoch.timestamps.start && data.epoch.timestamps.end && (
        <EpochCountdown
          containerClass="staking-node__epoch"
          id={data.epoch.id}
          startDate={new Date(data.epoch.timestamps.start)}
          endDate={new Date(data.epoch.timestamps.end)}
        />
      )}
      <YourStake node={node} />
      <StakingForm />
    </>
  );
};
