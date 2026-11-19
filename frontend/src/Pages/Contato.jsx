import { useEffect, useState } from 'react';
import FeedLayout from '../components/FeedLayout.jsx';
import { enviarContato } from '../api/Route-book.jsx';
import '../assets/css/contato.css';

export default function Contato() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [toast, setToast] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const res = await enviarContato({ nome, email, mensagem });
      setToast({ tipo: 'sucesso', texto: res.data?.mensagem || 'Sua mensagem foi enviada com sucesso! Obrigado pelo contato.' });
      setNome('');
      setEmail('');
      setMensagem('');
    } catch (err) {
      setToast({ tipo: 'erro', texto: err.response?.data?.mensagem || 'Não foi possível enviar sua mensagem. Tente novamente.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <FeedLayout showRight={false}><div className="contato-page">
      {toast && (
        <div role={toast.tipo === 'erro' ? 'alert' : 'status'} className={`toast-routebooks toast-${toast.tipo} show`}>
          <div className="toast-icon">
            <i className={toast.tipo === 'sucesso' ? 'fa fa-check' : 'fa fa-exclamation'}></i>
          </div>
          <div className="toast-content">
            <h5>Route Books</h5>
            <p>{toast.texto}</p>
          </div>
          <button type="button" aria-label="Fechar aviso" className="toast-close" onClick={() => setToast(null)}>
            <i className="fa fa-times"></i>
          </button>
          <div className="toast-progress"></div>
        </div>
      )}

      <section className="contato-geral">
        <div className="contato-titulo">
          <h1 className="fale-contato titulo-font">Fale Conosco</h1>
          <p className="p-contato">
            Mande a sua dúvida para a nossa equipe e te responderemos o mais breve possível! <br />
            Siga as outras formas de contato logo abaixo.
          </p>
        </div>

        <div className="container-contato">
          <div className="contato-texto">
            <div className="icone-geral-contato">
              <div className="icone-contato">
                <i className="fa fa-envelope-o" aria-hidden="true"></i>
              </div>
              <div className="info-contato">
                <h3 className="titulo-font">E-mail</h3>
                <p>routebooks.contato@gmail.com</p>
              </div>
            </div>

            <div className="icone-geral-contato">
              <div className="icone-contato">
                <i className="fa fa-phone" aria-hidden="true"></i>
              </div>
              <div className="info-contato">
                <h3 className="titulo-font">Telefone</h3>
                <p>(14) 9999-9999</p>
              </div>
            </div>
          </div>

          <div className="contato-form">
            <form onSubmit={handleEnviar}>
              <h2 className="titulo-font">Envie sua mensagem!</h2>

              <div className="input-div-contato">
                <label htmlFor="contato-nome" className="titulo-font">Nome Completo</label>
                <input id="contato-nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Insira seu nome completo..." />
              </div>

              <div className="input-div-contato">
                <label htmlFor="contato-email" className="titulo-font">E-mail</label>
                <input id="contato-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Insira seu e-mail..." />
              </div>

              <div className="input-div-contato">
                <label htmlFor="contato-mensagem" className="titulo-font">Digite sua mensagem</label>
                <textarea id="contato-mensagem" value={mensagem} onChange={(e) => setMensagem(e.target.value)} required placeholder="Digite sua mensagem aqui..." />
              </div>

              <div className="div-btn-contato">
                <button type="submit" className="titulo-font btn-contato" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div></FeedLayout>
  );
}
