import { Link } from "react-router-dom";
import { BulletHeader } from "../../components/bullet-header";
import { Links } from "../../lib/external-links";
import { NodeList } from "./node-list";

export const Staking = () => {
  return (
    <>
      <section>
        <BulletHeader tag="h2" style={{ marginTop: 0 }}>
          Step 1. Connect to a vega wallet
        </BulletHeader>
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
        <NodeList />
      </section>
    </>
  );
};
