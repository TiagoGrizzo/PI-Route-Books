import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/Route-book.jsx'; // Ajuste o caminho do seu arquivo de serviços do Axios

// Importação dos estilos originais
import '../assets/css/reset.css';
import '../assets/css/style.css';
import '../assets/css/login.css';

// Importação da logo (ajuste o caminho se necessário)
import logoImg from '../assets/imgs/rb-logo1.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // O backend espera um Dictionary<string, string> com "email" e "senhaHash"
      const response = await login({
        email: email,
        senhaHash: senha
      });

      // Sucesso no login (armazena dados básicos se necessário)
      const { usuarioId, nome } = response.data;
      localStorage.setItem('UsuarioId', usuarioId);
      localStorage.setItem('NomeUsuario', nome);

      // Redireciona para a home ou dashboard
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.mensagem) {
        setErro(err.response.data.mensagem);
      } else {
        setErro('Erro ao realizar login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-login">
      <section className="form-login-geral container-xxl">
        <form onSubmit={handleLogin} className="form-log">
          
          {erro && (
            <div style={{ 
              backgroundColor: '#e74c3c', 
              color: 'white', 
              padding: '10px', 
              borderRadius: '5px', 
              textAlign: 'center', 
              marginBottom: '15px', 
              fontFamily: 'sans-serif', 
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