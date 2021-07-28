import { Tranches } from './tranches'
import { render, screen } from '@testing-library/react'

jest.mock('../../lib/vega-web3')

test('renders tranches', async () => {
	render(<Tranches />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  expect(await screen.findByText(/tranches/i)).toBeInTheDocument()
})