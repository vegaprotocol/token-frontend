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
        "There are {{totalNodes}} nodes with a shared stake of {{totalStaked}} VEGA tokens",
        {
          totalNodes,
          totalStaked,
        }
      )}
    </p>
  );
};
