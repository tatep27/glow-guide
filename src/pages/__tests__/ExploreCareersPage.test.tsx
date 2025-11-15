import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ExploreCareersPage } from '../ExploreCareersPage'

describe('ExploreCareersPage', () => {
  it('renders explore careers page', () => {
    render(
      <BrowserRouter>
        <ExploreCareersPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/Explore Possible Futures/i)).toBeInTheDocument()
    expect(screen.getByText(/Discover career paths/i)).toBeInTheDocument()
  })
})

