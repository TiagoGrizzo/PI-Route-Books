import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getChatHistorico, getConversas, enviarMensagem } from '../api/Route-book.jsx';
import FeedLayout from '../components/FeedLayout.jsx';
import { Avatar } from '../components/PostCard.jsx';
import '../assets/css/chat.css';
const hora = data => new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dia = data => new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
export default function Chat() {
  const [params, setParams] = useSearchParams();
  const id = Number(params.get('idDoAmigo')) || null, uid = Number(localStorage.getItem('UsuarioId')) || null;
  const [conversas, setConversas] = useState([]), [mensagens, setMensagens] = useState([]), [amigo, setAmigo] = useState(null);
  const [filtro, setFiltro] = useState(''), [rascunhos, setRascunhos] = useState({}), [loading, setLoading] = useState(false), [loadingLista, setLoadingLista] = useState(!!uid);
  const [erro, setErro] = useState(''), [erroLista, setErroLista] = useState(''), [enviando, setEnviando] = useState(false), [emoji, setEmoji] = useState(false), [retry, setRetry] = useState(0);
  const box = useRef(null), lock = useRef(false), atual = useRef(id), rolar = useRef(true); atual.current = id;
  const texto = rascunhos[id] || '';
  const escrever = value => setRascunhos(d => ({ ...d, [id]: value }));
  const carregarLista = async () => { if (!uid) return; try { const r = await getConversas(); setConversas(r.data); setErroLista(''); } catch { setErroLista('Não foi possível carregar suas conversas.'); } finally { setLoadingLista(false); } };
  useEffect(() => { let vivo = true; if (uid) { carregarLista(); const timer = setInterval(() => { if (vivo && document.visibilityState === 'visible') carregarLista(); }, 5000); return () => { vivo = false; clearInterval(timer); }; } }, [uid, retry]);
  useEffect(() => {
    let vivo = true, ocupado = false; setMensagens([]); setAmigo(null); setErro(''); setEmoji(false); rolar.current = true;
    if (!uid || !id) { setLoading(false); return; }
    setLoading(true);
    const carregar = async (inicial = false) => { if (ocupado) return; ocupado = true; try { const r = await getChatHistorico(uid, id); if (vivo) { setAmigo(r.data.amigo); setMensagens(r.data.historico || []); setErro(''); setConversas(lista => lista.map(c => c.amigo.idUsuario === id ? { ...c, naoLidas: 0 } : c)); } } catch (e) { if (vivo) setErro(e.response?.data?.mensagem || 'Não foi possível carregar a conversa.'); } finally { ocupado = false; if (vivo && inicial) setLoading(false); } };
    carregar(true); const timer = setInterval(() => { if (document.visibilityState === 'visible') carregar(); }, 5000);
    return () => { vivo = false; clearInterval(timer); };
  }, [uid, id, retry]);
  useEffect(() => { if (rolar.current && box.current) box.current.scrollTop = box.current.scrollHeight; }, [mensagens, loading]);
  const enviar = async e => {
    e.preventDefault(); if (lock.current || !texto.trim() || !amigo || !uid) return;
    const destino = id, conteudo = texto.trim(); lock.current = true; setEnviando(true); setErro('');
    try { const r = await enviarMensagem({ destinatarioId: destino, texto: conteudo }); if (atual.current === destino) { rolar.current = true; setMensagens(lista => lista.some(m => m.id === r.data.novaMensagem.id) ? lista : [...lista, r.data.novaMensagem]); } setRascunhos(d => ({ ...d, [destino]: d[destino] === texto ? '' : d[destino] })); carregarLista(); }
    catch (e) { if (atual.current === destino) setErro(e.response?.data?.mensagem || 'Não foi possível enviar. Sua mensagem foi mantida para tentar novamente.'); }
    finally { lock.current = false; setEnviando(false); }
  };
  const vazio = <div className="messenger-empty"><span className="messenger-empty-icon"><i className="fa fa-comments-o" aria-hidden="true" /></span><h1>Selecione um aventureiro para conversar</h1><p>Escolha um amigo na página de Aventureiros para iniciar uma conversa.</p><Link to="/aventureiros" className="messenger-primary">Conhecer aventureiros <i className="fa fa-arrow-right" aria-hidden="true" /></Link>{!uid && <Link to={'/login?voltar=' + encodeURIComponent('/chat' + (id ? '?idDoAmigo=' + id : ''))} className="messenger-login">Entre na sua conta para conversar</Link>}</div>;
  const visiveis = conversas.filter(c => (c.amigo.nomeCompleto || c.amigo.username || '').toLocaleLowerCase('pt-BR').includes(filtro.toLocaleLowerCase('pt-BR')));
  return <FeedLayout showRight={false}><section className={'messenger' + (id && uid ? ' messenger-selected' : '')} aria-label="Chat privado">
    <aside className="messenger-list" aria-label="Conversas"><header className="messenger-list-title"><h2>Conversas <span>Chat Privado</span></h2><Link to="/aventureiros" aria-label="Iniciar nova conversa"><i className="fa fa-plus" aria-hidden="true" /></Link></header>
      <label className="messenger-filter"><i className="fa fa-search" aria-hidden="true" /><input aria-label="Filtrar aventureiros" type="search" value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Filtrar aventureiros..." /></label>
      <div className="messenger-threads">{loadingLista ? <p className="messenger-list-state">Carregando conversas...</p> : erroLista ? <p className="messenger-list-state" role="alert">{erroLista} <button onClick={() => setRetry(n => n + 1)}>Tentar novamente</button></p> : visiveis.length ? visiveis.map(c => <button className={'messenger-thread' + (id === c.amigo.idUsuario ? ' active' : '')} key={c.amigo.idUsuario} onClick={() => setParams({ idDoAmigo: c.amigo.idUsuario })}><Avatar pessoa={c.amigo} /><span className="messenger-thread-copy"><strong>{c.amigo.nomeCompleto || c.amigo.username}</strong><small>{c.ultimaMensagem.remetenteId === uid ? 'Você: ' : ''}{c.ultimaMensagem.texto}</small></span><span className="messenger-thread-meta"><time>{hora(c.ultimaMensagem.enviadoEm)}</time>{c.naoLidas > 0 && <b>{c.naoLidas}</b>}</span></button>) : <p className="messenger-list-state">{filtro ? 'Nenhuma conversa encontrada.' : 'Suas conversas aparecerão aqui.'}</p>}</div>
    </aside>
    <div className="messenger-conversation">
      {id && uid ? <><header className="messenger-person"><button className="messenger-back" onClick={() => setParams({})} aria-label="Voltar às conversas"><i className="fa fa-arrow-left" /></button>{amigo ? <><Link to={'/perfil/' + id} aria-label={'Ver perfil de ' + (amigo.nomeCompleto || amigo.nome)}><Avatar pessoa={amigo} /></Link><div><Link to={'/perfil/' + id}><strong>{amigo.nomeCompleto || amigo.nome || amigo.username}</strong></Link><small>{[amigo.cidade, amigo.uf, amigo.pais].filter(Boolean).join(', ') || 'Aventureiro Route Books'}</small></div></> : <strong>Carregando aventureiro...</strong>}</header>
        <div className="messenger-messages" ref={box} role="log" aria-label="Mensagens da conversa" onScroll={e => { const b = e.currentTarget; rolar.current = b.scrollHeight - b.scrollTop - b.clientHeight < 80; }}>
          {loading ? <p className="messenger-loading">Carregando conversa...</p> : !mensagens.length ? vazio : mensagens.map((m, i) => {
            const minha = m.remetenteId === uid; return <div key={m.id || m.enviadoEm + '-' + i}>{(!i || dia(m.enviadoEm) !== dia(mensagens[i - 1].enviadoEm)) && <div className="messenger-date"><span>{dia(m.enviadoEm)}</span></div>}<div className={'messenger-message' + (minha ? ' mine' : '')}>
              {!minha && <Avatar pessoa={amigo} />}<div className="messenger-message-content"><p>{m.texto}</p><time dateTime={m.enviadoEm}>{hora(m.enviadoEm)}{minha && <i className={'fa ' + (m.lida ? 'fa-check-circle-o' : 'fa-check')} aria-label={m.lida ? 'Lida' : 'Enviada'} />}</time></div></div></div>;
          })}
        </div>
        {erro && <div className="messenger-error" role="alert">{erro} <button onClick={() => setRetry(n => n + 1)}>Recarregar</button></div>}
        <form className="messenger-compose" onSubmit={enviar}><input aria-label="Mensagem" placeholder={'Enviar mensagem para ' + (amigo?.nomeCompleto || amigo?.nome || 'o aventureiro') + '...'} value={texto} onChange={e => escrever(e.target.value)} maxLength={3000} disabled={loading || !amigo || enviando} autoComplete="off" />
          <div className="messenger-emoji-wrap"><button type="button" className="messenger-emoji-button" aria-label="Escolher emoji" aria-expanded={emoji} onClick={() => setEmoji(v => !v)} disabled={!amigo || enviando}><i className="fa fa-smile-o" /></button>{emoji && <div className="messenger-emojis">{['👋', '😊', '🌎', '✈️', '🏕️', '❤️'].map(item => <button type="button" key={item} aria-label={'Adicionar ' + item} onClick={() => { escrever((texto + item).slice(0, 3000)); setEmoji(false); }}>{item}</button>)}</div>}</div>
          <button className="messenger-send" disabled={enviando || loading || !amigo || !texto.trim()} type="submit">{enviando ? 'Enviando...' : 'Enviar'} <i className="fa fa-paper-plane-o" aria-hidden="true" /></button>
        </form>
      </> : vazio}
    </div>
  </section></FeedLayout>;
}
