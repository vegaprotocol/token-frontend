import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";

interface StakeFailureProps {
  nodeId: string;
}

export const StakeFailure = ({ nodeId }: StakeFailureProps) => {
  const { t } = useTranslation();
  return (
    <Callout intent="error" title={t("Something went wrong")}>
      <p>
        {t("stakeFailed", {
          node: nodeId,
        })}
      </p>
    </Callout>
  );
};
