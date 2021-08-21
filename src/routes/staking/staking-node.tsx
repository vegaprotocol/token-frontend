import { useParams } from "react-router-dom";

export const StakingNode = () => {
  const { node } = useParams<{ node: string }>();
  return <h2>Node: {node}</h2>;
};
