import React from "react";
import { gql, useApolloClient } from "@apollo/client";
import {
  Erc20Approval,
  Erc20ApprovalVariables,
  Erc20Approval_erc20WithdrawalApproval,
} from "./__generated__/Erc20Approval";

const ERC20_APPROVAL_QUERY = gql`
  query Erc20Approval($withdrawalId: ID!) {
    erc20WithdrawalApproval(withdrawalId: $withdrawalId) {
      assetSource
      amount
      nonce
      signatures
      targetAddress
      expiry
    }
  }
`;

export const usePollERC20Approval = (withdrawalId: string) => {
  const client = useApolloClient();
  const [erc20Approval, setErc20Approval] =
    React.useState<Erc20Approval_erc20WithdrawalApproval | null>(null);

  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await client.query<Erc20Approval, Erc20ApprovalVariables>({
          query: ERC20_APPROVAL_QUERY,
          variables: { withdrawalId },
        });

        if (res.data.erc20WithdrawalApproval) {
          setErc20Approval(res.data.erc20WithdrawalApproval);
          clearInterval(interval);
        }
      } catch (err) {
        console.log("catch", err);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [client]);

  return erc20Approval;
};
