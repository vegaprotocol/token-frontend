import React from "react";
import { useTranslation } from "react-i18next";
import { ConnectToVega } from "../connect-to-vega";

export const AssociatePageNoVega = () => {
  const { t } = useTranslation();
  return (
    <section data-testid="associate">
      <p data-testid="associate-information">
        {t(
          "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
        )}
      </p>
      {<ConnectToVega />}
    </section>
  );
};
