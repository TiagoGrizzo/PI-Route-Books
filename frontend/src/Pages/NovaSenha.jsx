import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { novaSenha } from '../api/Route-book.jsx';
import '../assets/css/reset.css';
import '../assets/css/style.css';
import '../assets/css/novasenha.css';
import logoImg from '../assets/imgs/rb-logo1.png';

export default function NovaSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idUsuario = searchParams.get('idUsuario') || localStorage.getItem('UsuarioId') || '';

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleTrocar = async (e) => {
    e.preventDefault();
    setErro('');

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setEnviando(true);

    try {
      const res = await novaSenha({ idUsuario: String(idUsuario), senha: novaSenha });
      alert(res.data?.mensagem || 'Senha alterada com sucesso!');

      // Volta para a tela de login após trocar a senha
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Erro ao trocar a senha:', err);
      setErro(err.response?.data?.mensagem || 'Não foi possível alterar a senha. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="form-nova-geral auth-page auth-nova">
      <form onSubmit={handleTrocar} className="form-nov">
        <div className="logo">
          <img src={logoImg} className="logo-img" alt="Logo Route Books" />
        </div>

        <h2 className="titulo-nova">Nova senha</h2>

        <label htmlFor="novaSenha">Nova senha:</label>

        <div className="input-nova">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input id="novaSenha" type={mostrarSenha ? 'text' : 'password'} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Insira sua nova senha..." required />
          <button type="button" className="btn-mostrar-senha" id="mostrarSenha1" aria-label="Mostrar senha" onClick={() => setMostrarSenha(!mostrarSenha)}>
            <i className={`fa ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>

        <label htmlFor="confirmarSenha">Confirmar nova senha:</label>

        <div className="input-nova">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input id="confirmarSenha" type={mostrarSenha ? 'text' : 'password'} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Confirme sua nova senha..." required />
          <button type="button" className="btn-mostrar-senha" id="mostrarSenha2" aria-label="Mostrar confirmação da senha" onClick={() => setMostrarSenha(!mostrarSenha)}>
            <i className={`fa ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>

        {erro && <div className="text-danger">{erro}</div>}

        <div className="div-btn-nova">
          <button type="submit" className="btn-enviar-nova" disabled={enviando}>{enviando ? 'Trocando...' : 'Trocar senha'}</button>
        </div>
      </form>
    </section>
  );
}
