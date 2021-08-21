import { Link, useRouteMatch } from "react-router-dom";

export const Staking = () => {
  const match = useRouteMatch();
  return (
    <div>
      <h2>Staking</h2>
      <Link to={`${match.path}/some-node`}>Stake some-node</Link>
    </div>
  );
};
