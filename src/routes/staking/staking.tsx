import { Link, useRouteMatch } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const STATS_QUERY = gql`
  query {
    statistics {
      blockHeight
    }
  }
`;

export const Staking = () => {
  const match = useRouteMatch();
  const { data } = useQuery(STATS_QUERY);
  console.log(data);
  return (
    <div>
      <h2>Staking</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Link to={`${match.path}/some-node`}>Stake some-node</Link>
    </div>
  );
};
