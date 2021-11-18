import { useTranslation } from "react-i18next";
import { RouteChildProps } from "..";
import { Heading } from "../../components/heading";
import { Flags } from "../../config";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { RewardsIndex } from "./home";

const Rewards = ({ name }: RouteChildProps) => {
  const { t } = useTranslation();
  useDocumentTitle(name);

  return Flags.REWARDS_DISABLED ? (
    <>
      <Heading title={t("pageTitleRewards")} />
      <div>{t("rewardsComingSoon")}&nbsp;🚧👷‍♂️👷‍♀️🚧</div>
    </>
  ) : (
    <RewardsIndex />
  );
};

export default Rewards;
