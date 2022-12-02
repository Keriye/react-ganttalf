import 'jest-canvas-mock'

import * as React from 'react'

import { GanttCart } from '../src'
import { render } from '@testing-library/react'

describe('Common render', () => {
  it('renders without crashing', () => {
    render(<GanttCart />)
  })
})
