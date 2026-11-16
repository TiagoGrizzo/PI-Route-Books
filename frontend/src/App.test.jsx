import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

vi.mock('./components/SessionGate.jsx', () => ({ default: ({ children }) => children }));
vi.mock('./components/Layout.jsx', async () => {
  const { Outlet } = await import('react-router-dom');
  return { default: () => <Outlet /> };
});
vi.mock('./Pages/Posts.jsx', () => ({ default: () => <h1>Posts</h1> }));

test('o endereço inicial abre a página de posts', async () => {
  window.history.replaceState({}, '', '/');
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Posts' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/posts');
});
