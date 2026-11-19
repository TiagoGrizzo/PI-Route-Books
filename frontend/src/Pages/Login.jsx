import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getSessao } from '../api/Route-book.jsx';

import '../assets/css/reset.css';
import '../assets/css/style.css';
import '../assets/css/login.css';
import logoImg from '../assets/imgs/rb-logo1.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState(new URLSearchParams(window.location.search).has('sessao') ? 'Sua sessão terminou. Entre novamente para curtir e publicar.' : '');
  const [loading, setLoading] = useState(false);

  // Estados para o Toast personalizado
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const navigate = useNavigate();

  // Captura mensagem vinda do cadastro (ou outras telas) via localStorage
  useEffect(() => {
    const mensagemSalva = localStorage.getItem('toastMessage');
    const tipoSalvo = localStorage.getItem('toastType');

    if (mensagemSalva) {
      setToast({
        show: true,
        message: mensagemSalva,
        type: tipoSalvo || 'success'
      });

      localStorage.removeItem('toastMessage');
      localStorage.removeItem('toastType');

      // Some com o toast automaticamente após 4 segundos
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4000);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await login({
        email: email,
        senhaHash: senha
      });

      const sessao = await getSessao();
      const { usuarioId, nome } = sessao.data;
      localStorage.setItem('UsuarioId', usuarioId);
      localStorage.setItem('NomeUsuario', nome);

      const destino = new URLSearchParams(window.location.search).get('voltar');
      navigate(destino?.startsWith('/') && !destino.startsWith('//') ? destino : '/posts');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.mensagem) {
        setErro(err.response.data.mensagem);
      } else {
        setErro('Ops! Verifique sua conexão ou tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-login">
      {/* Elemento Visual do Toast Padrão Route Books */}
      <div className={`toast-routebooks toast-light ${toast.show ? 'show' : ''} ${toast.type === 'error' ? 'toast-erro' : ''}`}>
        <div className="toast-icon">
          <i className={`fa ${toast.type === 'error' ? 'fa-exclamation' : 'fa-check'}`}></i>
        </div>
        <div className="toast-content">
          <h5>{toast.type === 'error' ? 'Atenção' : 'Sucesso!'}</h5>
          <p>{toast.message}</p>
        </div>
        <button className="toast-close" onClick={() => setToast({ ...toast, show: false })}>
          <i className="fa fa-times"></i>
        </button>
        <div className="toast-progress"></div>
      </div>

      <section className="form-login-geral container-xxl">
        <form onSubmit={handleLogin} className="form-log">

          {erro && (
            <div style={{
              backgroundColor: '#042317',
              borderLeft: '5px solid #EC4772',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              textAlign: 'left',
              marginBottom: '15px',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '14px'
            }}>
              {erro}
            </div>
          )}

          <div className="logo">
            <img src={logoImg} className="logo-img" alt="Logo Route Books" />
          </div>
          <h2 className="titulo-login">Entrar no Route Books</h2>

          <label htmlFor="email">E-mail</label>
          <div className="input-login">
            <i className="fa fa-envelope-o" aria-hidden="true"></i>
            <input
              className="input-email"
              name="email"
              type="email"
              placeholder="Insira seu e-mail..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="senha">Senha:</label>
          <div className="input-login">
            <i className="fa fa-lock" aria-hidden="true"></i>

            <input
              id="senha"
              className="input-senha"
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Insira sua senha..."
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <button
              type="button"
              id="mostrarSenha"
              className="btn-mostrar-senha"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              <i className={`fa ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
            </button>
          </div>

          <div className="link-login">
            <Link to="/esqueceu-senha">Esqueci minha senha</Link>
          </div>

          <div className="div-btn-login">
            <button type="submit" className="btn-logar" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          <br />

          <div className="link-login-cad">
            Não tem uma conta? &nbsp;
            <Link to="/cadastro">Cadastre-se já!</Link>
          </div>
        </form>
      </section>
    </div>
  );
}