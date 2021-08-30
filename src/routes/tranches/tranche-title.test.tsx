import { render, screen } from '@testing-library/react'
import * as React from 'react'

import { TrancheTitle } from "./tranche-title";
import {Addresses, EthereumChainIds} from "../../lib/web3-utils";



it('Renders null for right contract address, wrong network', () => {
  const props = {
    chainId: EthereumChainIds.Goerli,
    contract: Addresses[EthereumChainIds.Mainnet].vestingAddress,
    id: 5
  }

  const { container } = render(
    <TrancheTitle {...props} />);

  expect(container).toBeEmptyDOMElement()
})

it('Renders null for right network, wrong contract address', () => {
  const props = {
    chainId: EthereumChainIds.Mainnet,
    contract: '0x0',
    id: 5
  }

  const { container } = render(
    <TrancheTitle {...props} />);

  expect(container).toBeEmptyDOMElement()
})

it('Renders null for right network, right contract address, tranche without a name', () => {
  const props = {
    chainId: EthereumChainIds.Mainnet,
    contract: Addresses[EthereumChainIds.Mainnet].vestingAddress,
    id: 0
  }

  const { container } = render(
    <TrancheTitle {...props} />);

  expect(container).toBeEmptyDOMElement()
})

it('Renders Test for right network, right contract address, tranche with a name', () => {
  const props = {
    chainId: EthereumChainIds.Mainnet,
    contract: Addresses[EthereumChainIds.Mainnet].vestingAddress,
    id: 5
  }

  const { container } = render(
    <TrancheTitle {...props} />);

  expect(container).toHaveTextContent('Coinlist Option 1 / Community Whitelist')
})
