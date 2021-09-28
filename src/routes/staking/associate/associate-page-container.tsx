import React from "react";

import { StakingWalletsContainer } from "../staking-wallets-container";
import { useEthereumConfig } from "../../../hooks/use-ethereum-config";
import { AssociatePage } from "./associate-page";
import { AssociatePageNoVega } from "./associate-page-no-vega";

export const NetworkParamsContainer = ({
  children,
}: {
  children: (data: { confirmations: number }) => React.ReactElement;
}) => {
  const config = useEthereumConfig();
  if (!config) {
    return null;
  }
  return children({ confirmations: config.confirmations });
};

export const AssociateContainer = () => {
  return (
    <NetworkParamsContainer>
      {(data) => (
        <StakingWalletsContainer needsEthereum={true} needsVega={false}>
          {({ address, currVegaKey = null }) =>
            currVegaKey ? (
              <AssociatePage
                address={address}
                vegaKey={currVegaKey}
                requiredConfirmations={data.confirmations}
              />
            ) : (
              <AssociatePageNoVega />
            )
          }
        </StakingWalletsContainer>
      )}
    </NetworkParamsContainer>
  );
};
