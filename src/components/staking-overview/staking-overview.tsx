import React from "react";
import {useTranslation} from "react-i18next";

export const StakingOverview = () => {
  const {t} = useTranslation();

  // TODO: Fetch values
  const nodeCount = 13;
  const sharedStake = 123;

  return (<p>
    {t("There are {{nodeCount}} nodes with a shared stake of {{sharedStake}} VEGA tokens", {
      nodeCount,
      sharedStake
    })}</p>);
}
