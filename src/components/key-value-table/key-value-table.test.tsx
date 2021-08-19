import { render, screen } from '@testing-library/react'
import * as React from 'react'

import { KeyValueTable, KeyValueTableRow } from './key-value-table'

const props = {
  title: 'Title'
}

it('Renders the correct elements', () => {
  const { container } = render(
    <KeyValueTable {...props}>
      <KeyValueTableRow>
        <td>My label</td>
        <td>My value</td>
      </KeyValueTableRow>
      <KeyValueTableRow>
        <td>My label 2</td>
        <td>My value 2</td>
      </KeyValueTableRow>
    </KeyValueTable>
  )

  expect(screen.getByText(props.title)).toBeInTheDocument()

  expect(container.querySelector('.key-value-table')).toBeInTheDocument()
  expect(container.querySelectorAll('.key-value-table__row')).toHaveLength(2)

  const rows = container.querySelectorAll('.key-value-table__row')
  // Row 1
  expect(rows[0].firstChild).toHaveTextContent('My label')
  expect(rows[0].children[1]).toHaveTextContent('My value')

  // Row 2
  expect(rows[1].firstChild).toHaveTextContent('My label 2')
  expect(rows[1].children[1]).toHaveTextContent('My value 2')
})
