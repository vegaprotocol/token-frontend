import { Heading } from "../../components/heading";
import { VegaWalletPrompt } from "../../components/vega-wallet-prompt";

export const WithdrawPending = () => {
  return (
    <>
      <Heading title="Incomplete withdrawals" />
      <VegaWalletPrompt>
        {(currVegaKey) => <div>{currVegaKey.pub}</div>}
      </VegaWalletPrompt>
    </>
  );
};
