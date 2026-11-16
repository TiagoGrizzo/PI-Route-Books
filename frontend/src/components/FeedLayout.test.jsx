import { beforeEach, afterEach, test, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeedLayout from './FeedLayout.jsx';
import { getComunidades, getPerfilPublico, getUsuariosSeguidos, getNaoLidas } from '../api/Route-book.jsx';

vi.mock('../api/Route-book.jsx', () => ({
  logout: vi.fn(), getComunidades: vi.fn(), getPerfilPublico: vi.fn(),
  getAventureiros: vi.fn(), getUsuariosSeguidos: vi.fn(), seguirUsuario: vi.fn(),
  deixarDeSeguirUsuario: vi.fn(), getNaoLidas: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  localStorage.setItem('UsuarioId', '1');
  localStorage.setItem('rb_seguidores_vistos_1', '2');
  getComunidades.mockResolvedValue({ data: [] });
  getUsuariosSeguidos.mockResolvedValue({ data: [] });
  getPerfilPublico.mockResolvedValue({ data: { nomeCompleto: 'Teste', seguidoresCount: 3 } });
  getNaoLidas.mockResolvedValue({ data: { qtd: 2 } });
});
afterEach(() => { cleanup(); localStorage.clear(); });
const abrir = () => render(<MemoryRouter initialEntries={['/posts']}><FeedLayout showRight={false}><h1>Posts</h1></FeedLayout></MemoryRouter>);

test('sino e conversa sinalizam novos seguidores e mensagens no formato do backend', async () => {
  abrir();
  const sino = await screen.findByRole('link', { name: 'Aventureiros, novos seguidores' });
  const chat = await screen.findByRole('link', { name: 'Conversas, mensagens não lidas' });
  expect(sino.querySelector('.feed-notif-dot')).toBeInTheDocument();
  expect(chat.querySelector('.feed-notif-dot')).toBeInTheDocument();
  expect(chat.querySelector('.feed-notif-dot')).toBeEmptyDOMElement();
});

test('sem novidades, os ícones ficam sem bolinhas', async () => {
  getNaoLidas.mockResolvedValue({ data: { qtd: 0 } });
  getPerfilPublico.mockResolvedValue({ data: { nomeCompleto: 'Teste', seguidoresCount: 2 } });
  const { container } = abrir();
  await screen.findByText('Teste');
  expect(container.querySelectorAll('.feed-notif-dot')).toHaveLength(0);
});

test('abrir o sino limpa o aviso e registra os seguidores vistos', async () => {
  abrir();
  fireEvent.click(await screen.findByRole('link', { name: 'Aventureiros, novos seguidores' }));
  await waitFor(() => expect(screen.getByRole('link', { name: 'Aventureiros' }).querySelector('.feed-notif-dot')).toBeNull());
  expect(localStorage.getItem('rb_seguidores_vistos_1')).toBe('3');
});

test('abrir a lista de conversas não apaga o aviso de mensagens ainda não lidas', async () => {
  abrir();
  fireEvent.click(await screen.findByRole('link', { name: 'Conversas, mensagens não lidas' }));
  expect(screen.getByRole('link', { name: 'Conversas, mensagens não lidas' }).querySelector('.feed-notif-dot')).toBeInTheDocument();
});
