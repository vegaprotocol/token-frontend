import { render, screen } from '@testing-library/react'
import * as React from 'react'

import { TrancheTitle } from "./tranche-title";
import {Addresses, EthereumChainIds} from "../../lib/web3-utils";


const props = {
  chainId: EthereumChainIds.Mainnet,
  contract: Addresses[EthereumChainIds.Mainnet].vestingAddress,
  id: 5
}

it('Renders null for right contract address, wrong network', () => {
  const WRONG_CHAIN = EthereumChainIds.Goerli;
  const { container } = render(
    <TrancheTitle {...props} chainId={WRONG_CHAIN} />);

  expect(container).toBeEmptyDOMElement()
})

it('Renders null for right network, wrong contract address', () => {
  const WRONG_ADDRESS = "0x0";

  const { container } = render(
    <TrancheTitle {...props} contract={WRONG_ADDRESS} />);

  expect(container).toBeEmptyDOMElement()
})

it('Renders null for right network, right contract address, tranche without a name', () => {
  const UNNAMED_TRANCHE = 0;

  const { container } = render(
    <TrancheTitle {...props} id={UNNAMED_TRANCHE} />);

  expect(container).toBeEmptyDOMElement()
})

it('Renders named for right network, right contract address, tranche with a name', () => {
  const { container } = render(<TrancheTitle {...props} />);
  expect(container).toHaveTextContent('Coinlist Option 1 / Community Whitelist')
})
