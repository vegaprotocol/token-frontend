import { Tranches } from './tranches'
import { render, screen } from '@testing-library/react'
import {Tranche} from "../../lib/vega-web3-types";
import {addDays, subDays} from "date-fns";
import {MemoryRouter} from "react-router-dom";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock('../../lib/vega-web3')

function mockTranche(): Tranche{
  return {
    tranche_id: Math.random().toString(),
    tranche_start: subDays(Date.now(), 1),
    tranche_end: addDays(Date.now(), 1),
    total_added: Math.random(),
    total_removed: Math.random(),
    locked_amount: Math.random(),
    deposits: [],
    withdrawals: [],
    users: []
  }
}

test('renders tranches', async () => {
  const tranches: Tranche[] = [mockTranche()]

  render(<MemoryRouter>
    <Tranches tranches={tranches} />
  </MemoryRouter>)

  expect(await screen.findByText(/tranches/i)).toBeInTheDocument()
})
