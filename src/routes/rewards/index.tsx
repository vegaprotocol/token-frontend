import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RewardsIndex } from "./home";

const Rewards = ({ name }: RouteChildProps) => {
  useDocumentTitle(name);
  return <RewardsIndex />;
};

export default Rewards;
