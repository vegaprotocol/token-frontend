import "./staking-node.scss";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ValidatorTable } from "./validator-table";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { EpochCountdown } from "./epoch-countdown";
import { YourStake } from "./your-stake";
import { StakingForm } from "./staking-form";
import { gql, useQuery } from "@apollo/client";
import { StakeNode, StakeNodeVariables } from "./__generated__/StakeNode";
import { Callout } from "../../components/callout";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";

export const STAKE_NODE_QUERY = gql`
  query StakeNode($nodeId: String!, $partyId: ID!) {
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
    nodeData {
      stakedTotal
    }
    party(id: $partyId) {
      id
      delegations(nodeId: $nodeId) {
        amount
        epoch
      }
    }
  }
`;

interface StakingNodeProps {
  vegaKey: VegaKeyExtended;
}

export const StakingNode = ({ vegaKey }: StakingNodeProps) => {
  // TODO: Remove and get id via useParams. Eg:
  // const node = useParams<{ node: string }>()
  const node = TEMP_useNodeIdFromLocation();
  const { t } = useTranslation();
  const { data, loading, error } = useQuery<StakeNode, StakeNodeVariables>(
    STAKE_NODE_QUERY,
    {
      variables: { nodeId: node, partyId: vegaKey.pub },
      skip: !node,
    }
  );

  if (error) {
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <p>Query for node {node} failed.</p>
        <pre>{error.message}</pre>
      </Callout>
    );
  }

  if (loading || !data?.node || !data?.epoch) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  // TODO: update ui
  // const renderStakeChild = () => {
  //   switch () {
  //     case RemoveStakeStatus.None:
  //       return <StakingForm nodeId={node} pubkey={vegaKey.pub} />;
  //     case RemoveStakeStatus.Pending:
  //       return <StakingCalloutRemoving amount={amount} node={node} />;
  //     case RemoveStakeStatus.Ready:
  //       return <CalloutRemoveSuccess amount={amount} node={node} />;
  //     default:
  //       return <div>Not Found</div>;
  //   }
  // };

  return (
    <>
      <h2 style={{ wordBreak: "break-word" }}>
        {t("VALIDATOR {{node}}", { node })}
      </h2>
      <p>Vega key: {vegaKey.pubShort}</p>
      <ValidatorTable
        node={data.node}
        stakedTotal={data.nodeData?.stakedTotal || "0"}
      />
      {data.epoch.timestamps.start && data.epoch.timestamps.end && (
        <EpochCountdown
          containerClass="staking-node__epoch"
          id={data.epoch.id}
          startDate={new Date(data.epoch.timestamps.start)}
          endDate={new Date(data.epoch.timestamps.end)}
        />
      )}
      <YourStake
        currentEpoch={data.epoch.id}
        delegations={data.party?.delegations || []}
      />
      <StakingForm pubkey={vegaKey.pub} nodeId={node} />
    </>
  );
};

// Hook to get the node id from the url. We need this because currently
// the ides contain slashes which means the paths dont correctly match in
// react router.
function TEMP_useNodeIdFromLocation() {
  const location = useLocation();
  const regex = /\/staking\/(.+)$/;
  const res = regex.exec(location.pathname);
  if (res) {
    return res[1];
  }
  return "";
}
