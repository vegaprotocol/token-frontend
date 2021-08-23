import { useTranslation } from "react-i18next";

export const StakingOverview = ({
  totalStakedFormatted,
}: {
  totalStakedFormatted: string;
}) => {
  const { t } = useTranslation();

  // TODO: Fetch values
  const nodeCount = 13;
  const sharedStake = totalStakedFormatted;

  return (
    <p>
      {t(
        "There are {{nodeCount}} nodes with a shared stake of {{sharedStake}} VEGA tokens",
        {
          nodeCount,
          sharedStake,
        }
      )}
    </p>
  );
};
