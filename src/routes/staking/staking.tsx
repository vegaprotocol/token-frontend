import { Link, useRouteMatch } from "react-router-dom";
import { BulletHeader } from "../../components/bullet-header";
import { Links } from "../../lib/external-links";

export const Staking = () => {
  const match = useRouteMatch();
  return (
    <>
      <section>
        <BulletHeader tag="h2">Step 1. Connect to a vega wallet</BulletHeader>
        <p>
          You will need a{" "}
          <a href={Links.VEGA_WALLET_RELEASES} target="_blank" rel="noreferrer">
            Vega wallet
          </a>{" "}
          to control stake and receive staking rewards.
        </p>
      </section>
      <section>
        <BulletHeader tag="h2">
          Step 2. Associate tokens with a Vega wallet
        </BulletHeader>
        <p>
          Your tokens need to be{" "}
          <Link to="/associate">associated with a Vega wallet</Link> so that it
          can control your stake
        </p>
      </section>
      <section>
        <BulletHeader tag="h2">
          Step 3. Select the validator you'd like to nominate
        </BulletHeader>
        <div>
          <Link to={`${match.path}/${"node"}`}>Some node</Link>
        </div>
      </section>
    </>
  );
};
