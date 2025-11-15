import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TimelinePage } from '../TimelinePage'

describe('TimelinePage', () => {
  it('renders timeline page', () => {
    render(
      <BrowserRouter>
        <TimelinePage />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/Your High School Journey/i)).toBeInTheDocument()
  })
})

