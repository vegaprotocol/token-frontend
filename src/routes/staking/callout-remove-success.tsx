import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Tick } from "../../components/icons";

interface CalloutRemoveSuccessProps {
  amount: string;
  node: string;
}

export const CalloutRemoveSuccess = ({amount, node}: CalloutRemoveSuccessProps) => {
  const { t } = useTranslation()

  const time = "3 minutes";
  return (
    <Callout
      icon={<Tick />}
      intent="success"
      title={t("{{amount}} Has been removed to {{node}}", {
        amount,
        node,
      })}
    >
      <div>
        <p>{t("It will be applied in the next epoch", { time })}</p>
        <button>{t("Nominate another node with your stake")}</button>
        <button>{t("Dissociate VEGA tokens")}</button>
      </div>
    </Callout>
  );
};