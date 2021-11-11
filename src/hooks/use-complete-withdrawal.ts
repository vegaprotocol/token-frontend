import { gql, useApolloClient } from "@apollo/client";
import React from "react";

export const useCompleteWithdrawal = () => {
  const client = useApolloClient();
  const submit = React.useCallback(async () => {
    console.log("submit");
    // withdraw_asset(
    //   erc20Withdrawal.assetSource,
    //   erc20Withdrawal.amount,
    //   erc20Withdrawal.expiry,
    //   withdrawal.details.receiverAddress,
    //   erc20Withdrawal.nonce,
    //   erc20Withdrawal.signatures
    // );
  }, []);

  return submit;
};
