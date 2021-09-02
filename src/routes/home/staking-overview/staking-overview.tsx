import { useTranslation } from "react-i18next";

export const StakingOverview = ({
  totalStaked,
  totalNodes,
}: {
  totalStaked: string;
  totalNodes: number;
}) => {
  const { t } = useTranslation();

  return (
    <p>
      {t(
        "There are {{nodeCount}} nodes with a shared stake of {{sharedStake}} VEGA tokens",
        {
          totalNodes,
          totalStaked,
        }
      )}
    </p>
  );
};
