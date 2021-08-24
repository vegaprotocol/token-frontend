import { useParams } from "react-router-dom";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";

interface StakingNodeProps {
  vegaKey: VegaKeyExtended;
}

export const StakingNode = ({ vegaKey }: StakingNodeProps) => {
  const { node } = useParams<{ node: string }>();
  return (
    <>
      <h2>Node: {node}</h2>
      <p>Vega key: {vegaKey.pubShort}</p>
    </>
  );
};
