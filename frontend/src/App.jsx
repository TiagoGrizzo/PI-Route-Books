import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import SessionGate from './components/SessionGate.jsx';
import Layout from './components/Layout.jsx';
import Login from "./Pages/Login.jsx";
import CriarPost from "./Pages/CriarPost.jsx";
import Posts from "./Pages/Posts.jsx";
import PostDetalhes from "./Pages/PostDetalhes.jsx";
import Sobre from "./Pages/Sobre.jsx";
import Contato from "./Pages/Contato.jsx";
import Cadastro from "./Pages/Cadastro.jsx";
import EsqueciSenha from "./Pages/EsqueciSenha.jsx";
import NovaSenha from "./Pages/NovaSenha.jsx";
import Aventureiros from "./Pages/Aventureiros.jsx";
import Chat from "./Pages/Chat.jsx";
import Comunidade from './Pages/Comunidade.jsx';
import Perfil from "./Pages/Perfil.jsx";
import DestinosEmAlta from "./Pages/DestinosEmAlta.jsx";
import Admin from './Pages/Admin.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import AdminPosts from './Pages/AdminPosts.jsx';
import { useEffect, useState } from 'react';
import { getSessao } from './api/Route-book.jsx';

function AdminOnly({ children }) {
  const [status, setStatus] = useState('verificando');
  useEffect(() => {
    let ativo = true;
    getSessao().then(({ data }) => {
      if (!ativo) return;
      localStorage.setItem('UsuarioRole', data.role || 'Usuario');
      setStatus(data.role === 'Admin' ? 'admin' : 'negado');
    }).catch(() => { if (ativo) setStatus('negado'); });
    return () => { ativo = false; };
  }, []);
  if (status === 'verificando') return <div role="status" style={{ padding: 32 }}>Verificando acesso administrativo...</div>;
  return status === 'admin' ? children : <Navigate to="/posts" replace />;
}

function RegularUserOnly() {
  return localStorage.getItem('UsuarioRole') === 'Admin'
    ? <Navigate to="/admin" replace />
    : <Outlet />;
}

function App() {
  return (
    <Router><SessionGate>
      {/* Telas de autenticação (login/cadastro/recupero de senha) são standalone (sem navbar/footer) */}
      <Routes>
        <Route path="/admin" element={<AdminOnly><Admin /></AdminOnly>}>
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPosts />} />
        </Route>

        <Route element={<RegularUserOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueceu-senha" element={<EsqueciSenha />} />
          <Route path="/nova-senha" element={<NovaSenha />} />
          <Route path="/destinos-em-alta" element={<DestinosEmAlta />} />

          {/* Demais páginas usam o layout padrão (navbar + footer) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/posts" replace />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/comunidades/:slug" element={<Comunidade />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/:id" element={<Perfil />} />
            <Route path="/posts/criar" element={<CriarPost />} />
            <Route path="/posts/detalhes/:id" element={<PostDetalhes />} />
            <Route path="/quem-somos" element={<Sobre />} />
            <Route path="/aventureiros" element={<Aventureiros />} />
            <Route path="/aventurerios" element={<Navigate to="/aventureiros" replace />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/contato" element={<Contato />} />
          </Route>
        </Route>
      </Routes>
    </SessionGate></Router>
  );
}

export default App;
