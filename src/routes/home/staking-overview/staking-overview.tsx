import React from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../../contexts/app-state/app-state-context";

export const StakingOverview = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();

  // TODO: Fetch values
  const nodeCount = 13;
  const sharedStake = appState.totalStakedFormatted;

  return (<p>
    {t("There are {{nodeCount}} nodes with a shared stake of {{sharedStake}} VEGA tokens", {
      nodeCount,
      sharedStake
    })}</p>);
}
