import React from "react";

export const useCompleteWithdrawal = () => {
  const submit = React.useCallback(async () => {
    console.log("submit");
    // TODO: execute withdrawal on erc20 bridge contract
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
