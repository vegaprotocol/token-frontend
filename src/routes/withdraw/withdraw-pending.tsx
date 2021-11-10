import { Heading } from "../../components/heading";
import { VegaWalletContainer } from "../../components/vega-wallet-container";

export const WithdrawPending = () => {
  return (
    <>
      <Heading title="Incomplete withdrawals" />
      <VegaWalletContainer>
        {(currVegaKey) => <div>{currVegaKey.pub}</div>}
      </VegaWalletContainer>
    </>
  );
};
