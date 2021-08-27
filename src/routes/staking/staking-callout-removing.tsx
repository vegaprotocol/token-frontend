import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Loader } from "../../components/loader";

interface StakingCalloutRemovingProps {
  amount: string;
  node: string
}

export const StakingCalloutRemoving = ({amount, node}: StakingCalloutRemovingProps) => {
  const { t } = useTranslation()
  const time = "3 minutes"
  return (
    <Callout
      icon={<Loader />}
      title={t("Removing {{amount}} VEGA from {{node}}", {
        amount,
        node,
      })}
    >
      <>
        <p>
          {t("This should take approximately ({{time}}) to confirm.", { time })}
        </p>
      </>
    </Callout>
  );
};