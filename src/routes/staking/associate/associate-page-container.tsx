import React from "react";

import { StakingWalletsContainer } from "../staking-wallets-container";
import { useEthereumConfig } from "../../../hooks/use-ethereum-config";
import { AssociatePage } from "./associate-page";
import { AssociatePageNoVega } from "./associate-page-no-vega";
import { useMinDelegation } from "../../../hooks/use-min-delegation";
import { BigNumber } from "../../../lib/bignumber";

export const NetworkParamsContainer = ({
  children,
}: {
  children: (data: {
    confirmations: number;
    minDelegation: BigNumber;
  }) => React.ReactElement;
}) => {
  const config = useEthereumConfig();
  const minDelegation = useMinDelegation();

  if (!config || !minDelegation) {
    return null;
  }

  return children({
    confirmations: config.confirmations,
    minDelegation,
  });
};

export const AssociateContainer = () => {
  return (
    <NetworkParamsContainer>
      {({ confirmations, minDelegation }) => (
        <StakingWalletsContainer>
          {({ address, currVegaKey }) =>
            currVegaKey ? (
              <AssociatePage
                address={address}
                vegaKey={currVegaKey}
                requiredConfirmations={confirmations}
                minDelegation={minDelegation}
              />
            ) : (
              <AssociatePageNoVega minDelegation={minDelegation} />
            )
          }
        </StakingWalletsContainer>
      )}
    </NetworkParamsContainer>
  );
};
