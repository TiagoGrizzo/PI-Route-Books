import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../api/Route-book.jsx';
import '../assets/css/admin.css';

export default function Admin() {
  const navigate = useNavigate();

  const sairDaConta = async () => {
    try {
      await logout();
      localStorage.removeItem('UsuarioId');
      localStorage.removeItem('NomeUsuario');
      localStorage.removeItem('UsuarioRole');
      navigate('/login');
    } catch {
      window.alert('Não foi possível sair. Tente novamente.');
    }
  };

  return <div className="admin-shell">
    <aside className="admin-aside">
      <div className="admin-brand"><span className="admin-brand-mark">RB</span><div><strong>Route Books</strong><small>Painel administrativo</small></div></div>
      <p className="admin-nav-label">ADMINISTRAÇÃO</p>
      <nav aria-label="Navegação administrativa">
        <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}><i className="fa fa-th-large" /> Dashboard</NavLink>
        <NavLink to="/admin/posts" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}><i className="fa fa-file-text-o" /> Gerência de posts</NavLink>
      </nav>
      <button type="button" className="admin-nav-link" onClick={sairDaConta} style={{ width: '100%', border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' }}><i className="fa fa-sign-out" /> Sair da conta</button>
      <div className="admin-aside-footer">Moderação responsável<br /><span>Route Books © 2026</span></div>
    </aside>
    <main className="admin-main"><Outlet /></main>
  </div>;
}
