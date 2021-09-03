import { render } from "@testing-library/react";
import { TrancheLabel } from "./tranche-label";
import { EthereumChainIds } from "../../lib/web3-utils";

let props: any;

beforeEach(() => {
  props = {
    chainId: EthereumChainIds.Mainnet,
    contract: "0x23d1bFE8fA50a167816fBD79D7932577c06011f4",
    id: 5,
  };
});

it("Renders null for right contract address, wrong network", () => {
  const WRONG_CHAIN = EthereumChainIds.Goerli;
  const { container } = render(
    <TrancheLabel {...props} chainId={WRONG_CHAIN} />
  );

  expect(container).toBeEmptyDOMElement();
});

it("Renders null for right network, wrong contract address", () => {
  const WRONG_ADDRESS = "0x0";

  const { container } = render(
    <TrancheLabel {...props} contract={WRONG_ADDRESS} />
  );

  expect(container).toBeEmptyDOMElement();
});

it("Renders null for right network, right contract address, tranche without a name", () => {
  const UNNAMED_TRANCHE = 0;

  const { container } = render(
    <TrancheLabel {...props} id={UNNAMED_TRANCHE} />
  );

  expect(container).toBeEmptyDOMElement();
});

it("Renders named for right network, right contract address, tranche with a name", () => {
  const { container } = render(<TrancheLabel {...props} />);
  expect(container).toHaveTextContent("Coinlist Option 1Community Whitelist");
});
