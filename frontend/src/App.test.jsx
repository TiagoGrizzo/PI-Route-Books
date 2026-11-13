import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'

vi.mock('./api/Route-book', () => ({
  getUltimosPosts: vi.fn().mockResolvedValue({ data: [] }),
}))

test('landing page exibe o botão de começar e leva para /posts', async () => {
  render(<MemoryRouter><LandingPage /></MemoryRouter>)
  const botao = await screen.findByRole('link', { name: /comece sua aventura/i })
  expect(botao).toHaveAttribute('href', '/posts')
})