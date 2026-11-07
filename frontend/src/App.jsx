import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SessionGate from './components/SessionGate.jsx';
import Layout from './components/Layout.jsx';
import LandingPage from "./Pages/LandingPage.jsx";
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

function App() {
  return (
    <Router><SessionGate>
      {/* Telas de autenticação (login/cadastro/recupero de senha) são standalone (sem navbar/footer) */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueceu-senha" element={<EsqueciSenha />} />
        <Route path="/nova-senha" element={<NovaSenha />} />

        {/* Demais páginas usam o layout padrão (navbar + footer) */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
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
      </Routes>
    </SessionGate></Router>
  );
}

export default App;
