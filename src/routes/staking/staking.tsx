import { Link, useRouteMatch } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Stats } from "./__generated__/Stats";

const STATS_QUERY = gql`
  query Stats {
    statistics {
      blockHeight
    }
  }
`;

export const Staking = () => {
  const match = useRouteMatch();
  const { data } = useQuery<Stats>(STATS_QUERY);
  return (
    <div>
      <h2>Staking</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Link data-testid="staking-item" to={`${match.path}/some-node`}>
        Stake some-node
      </Link>
    </div>
  );
};
