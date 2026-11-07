import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { esqueceuSenha } from '../api/Route-book.jsx';
import '../assets/css/reset.css';
import '../assets/css/style.css';
import '../assets/css/esqsenha.css';
import logoImg from '../assets/imgs/rb-logo1.png';

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleEnviar = async (e) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      const res = await esqueceuSenha({ email });
      alert(res.data?.mensagem || 'Instruções de recuperação enviadas com sucesso!');

      // Após solicitar a recuperação, leva o usuário para a troca de senha
      setTimeout(() => {
        navigate('/nova-senha');
      }, 1500);
    } catch (err) {
      console.error('Erro ao solicitar recuperação de senha:', err);
      setErro(err.response?.data?.mensagem || 'Não foi possível enviar as instruções de recuperação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="form-esqueceu-geral auth-page auth-recuperar">
      <form onSubmit={handleEnviar} className="form-esq">
        <div className="logo-esq">
          <img src={logoImg} className="logo-img" alt="Logo Route Books" />
        </div>

        <h4 className="titulo-esqueceu">Informe o e-mail que foi cadastrado previamente na sua conta</h4>

        <label htmlFor="email">E-mail:</label>

        <div className="input-esqueceu">
          <i className="fa fa-envelope-o" aria-hidden="true"></i>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Insira seu e-mail..." required />
        </div>

        {erro && <div className="text-danger">{erro}</div>}

        <div className="div-btn-enviar">
          <button type="submit" className="btn-enviar" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar'}</button>
        </div>
      </form>
    </section>
  );
}
