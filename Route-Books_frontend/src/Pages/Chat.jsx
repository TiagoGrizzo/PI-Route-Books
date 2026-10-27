import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getChatHistorico, enviarMensagem } from '../api/Route-book.jsx';
import '../assets/css/chat.css';

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idDoAmigo = searchParams.get('idDoAmigo');

  const [messages, setMessages] = useState([]);
  const [amigoNome, setAmigoNome] = useState('');
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const chatBoxRef = useRef(null);

  const meuId = Number(localStorage.getItem('UsuarioId'));

  useEffect(() => {
    if (!idDoAmigo) {
      setLoading(false);
      return;
    }

    let ativo = true;

    getChatHistorico(meuId, Number(idDoAmigo))
      .then((res) => {
        if (!ativo) return;
        setAmigoNome(res.data?.amigo?.amigo?.nome || res.data?.amigo?.nome || 'Aventureiro');
        setMessages(res.data?.historico || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro('Não foi possível carregar a conversa.');
        setLoading(false);
      });

    return () => { ativo = false; };
  }, [idDoAmigo]);

  // Rola a caixa de mensagens até a última
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleEnviar = async (e) => {
    e.preventDefault();

    if (!texto.trim() || !idDoAmigo) return;

    setEnviando(true);

    try {
      const res = await enviarMensagem({
        remetenteId: meuId,
        destinatarioId: Number(idDoAmigo),
        texto: texto.trim(),
        remetenteNome: localStorage.getItem('NomeUsuario') || 'Aventureiro'
      });

      const novaMensagem = res.data?.novaMensagem;
      if (novaMensagem) {
        setMessages((prev) => [...prev, novaMensagem]);
      }
      setTexto('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setErro('Não foi possível enviar a mensagem. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (!idDoAmigo) {
    return (
      <section className="container container-xxl mt-4 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card chat-card-main shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="card-body text-center mt-5 py-5">
                <i className="fa fa-comments d-block mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="titulo-font">Selecione um aventureiro para conversar</h5>
                <p className="small">Escolha um amigo na página de Aventureiros para iniciar uma conversa.</p>
                <button className="btn btn-success" onClick={() => navigate('/aventurerios')}>Conhecer aventureiros</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container container-xxl mt-4 flex-grow-1">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card chat-card-main shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            {/* Cabeçalho do Chat */}
            <div className="card-header chat-header p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <i className="fa fa-user-circle-o me-2 chat-icon-user"></i>
                <h5 className="mb-0 titulo-font text-white">{amigoNome}</h5>
              </div>
              <span className="badge bg-success" style={{ fontSize: '11px', borderRadius: '10px' }}>Chat Privado</span>
            </div>

            {/* Corpo / Caixa de Mensagens */}
            <div className="card-body chat-body" ref={chatBoxRef} id="chat-box" style={{ height: '430px', overflowY: 'auto', padding: '20px' }}>
              {loading ? (
                <div className="text-center mt-5 py-5 chat-empty-box">
                  <i className="fa fa-envelope-o d-block mb-3" style={{ fontSize: '3.5rem' }}></i>
                  <h6 className="titulo-font">Carregando conversa...</h6>
                </div>
              ) : erro ? (
                <div className="text-center mt-5 py-5 chat-empty-box">
                  <i className="fa fa-exclamation d-block mb-3" style={{ fontSize: '3.5rem' }}></i>
                  <h6 className="titulo-font">{erro}</h6>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const minhaMensagem = msg.remetenteId === meuId;

                  return (
                    <div key={msg.id ?? `${msg.enviadoEm}-${msg.remetenteId}`} className={`d-flex ${minhaMensagem ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
                      <div className={`card p-2 px-3 shadow-sm msg-balao ${minhaMensagem ? 'msg-minha' : 'msg-outros'}`} style={{ maxWidth: '75%', borderRadius: '15px' }}>
                        <p className="mb-0" style={{ fontSize: '14px', wordBreak: 'break-word' }}>{msg.texto}</p>
                        <small className="d-block text-end mt-1 msg-tempo" style={{ fontSize: '9px', opacity: 0.8 }}>
                          {new Date(msg.enviadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center mt-5 py-5 chat-empty-box">
                  <i className="fa fa-envelope-o d-block mb-3" style={{ fontSize: '3.5rem' }}></i>
                  <h6 className="titulo-font">Inicie a conversa!</h6>
                  <p className="small">Diga um "Olá" para {amigoNome} e comece a conversar.</p>
                </div>
              )}
            </div>

            {/* Rodapé / Input de Envio */}
            <div className="card-footer chat-footer p-3 border-top-0">
              <form onSubmit={handleEnviar} className="d-flex">
                <input
                  className="form-control me-2 search-bar input-chat-msg"
                  type="text"
                  placeholder={`Enviar mensagem para ${amigoNome}...`}
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  autoComplete="off"
                  required
                />
                <button className="btn btn-success px-4 btn-enviar-chat" type="submit" disabled={enviando} style={{ borderRadius: '20px', border: 'none' }}>
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
