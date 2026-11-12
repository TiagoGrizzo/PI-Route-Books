import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'

test('landing page exibe o botão de começar e leva para /posts', () => {
  render(<MemoryRouter><LandingPage /></MemoryRouter>)

  const botao = screen.getByRole('link', { name: /comece sua aventura/i })

  expect(botao).toBeInTheDocument()
  expect(botao).toHaveAttribute('href', '/posts')
})