import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL, AprovarPost, CancelarPost, getpostsPendentes } from '../api/Route-book.jsx';

const campo = (post, ...keys) => keys.map(key => post?.[key]).find(value => value !== undefined && value !== null && value !== '') || '';
const imagens = post => {
  try { const lista = JSON.parse(post.imagensJson || '[]'); return Array.isArray(lista) ? lista : []; }
  catch { return []; }
};
const urlImagem = value => value?.startsWith('http') ? value : `${API_BASE_URL}${value?.startsWith('/') ? '' : '/'}${value}`;

function PostPendente({ post, onAction, busy }) {
  const titulo = campo(post, 'titulo') || 'Publicação sem título';
  const conteudo = campo(post, 'conteudo', 'resumo');
  const media = [...new Set([...imagens(post), campo(post, 'imagemUrl')].filter(Boolean))];
  const autor = campo(post.autor, 'nomeCompleto', 'username') || 'Aventureiro';
  const data = campo(post, 'dataCriacao');
  return <article className="moderation-card">
    <header className="moderation-card-header"><div className="moderation-author"><span className="moderation-avatar"><i className="fa fa-user" /></span><div><strong>{autor}</strong><small>{data ? new Date(data).toLocaleString('pt-BR') : 'Data não informada'}</small></div></div><span className="pending-badge"><i className="fa fa-clock-o" /> Aguardando análise</span></header>
    <div className="moderation-content"><h2>{titulo}</h2>{campo(post, 'localizacao') && <p className="moderation-location"><i className="fa fa-map-marker" /> {post.localizacao}</p>}<p className="moderation-text">{conteudo || 'Esta publicação não possui texto.'}</p>
      {media.length > 0 && <div className="moderation-media">{media.map((src, i) => post.tipoMidia === 'video' ? <video key={src} controls src={urlImagem(src)} aria-label={`Vídeo do post ${i + 1}`} /> : <img key={src} src={urlImagem(src)} alt={`Mídia da publicação ${i + 1}`} />)}</div>}
    </div>
    <footer className="moderation-actions"><span>Confira texto e mídia antes de decidir.</span><div><button className="moderation-button reject" disabled={busy} onClick={() => onAction(post.idPost, 'cancelar')}><i className="fa fa-times" /> Cancelar post</button><button className="moderation-button approve" disabled={busy} onClick={() => onAction(post.idPost, 'aprovar')}><i className="fa fa-check" /> Aprovar post</button></div></footer>
  </article>;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState([]), 
  [loading, setLoading] = useState(true), 
  [erro, setErro] = useState(''), 
  [feedback, setFeedback] = useState(''), 
  [busyId, setBusyId] = useState(null);

  const carregar = useCallback(() => { setLoading(true); setErro(''); getpostsPendentes().then(r => setPosts(Array.isArray(r.data) ? r.data : [])).catch(e => setErro(e.response?.data?.mensagem || 'Não foi possível carregar os posts pendentes.')).finally(() => setLoading(false)); }, []);
  useEffect(() => { carregar(); }, [carregar]);
  const agir = async (id, acao) => {
    console.log(id)
    console.log(acao)
    setBusyId(id); setFeedback(''); setErro('');
    try { const resposta = acao === 'aprovar' ? await AprovarPost(id) : await CancelarPost(id); setPosts(lista => lista.filter(post => post.idPost !== id)); setFeedback(resposta.data?.mensagem || (acao === 'aprovar' ? 'Post aprovado.' : 'Post cancelado.')); }
    catch (e) { setErro(e.response?.data?.mensagem || 'Não foi possível concluir a moderação.'); }
    finally { setBusyId(null); }
  };
  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CONTEÚDO DA COMUNIDADE</span>
          <h1>Gerência de posts</h1>
          <p>Revise as publicações antes que sejam exibidas no feed.</p>
        </div>
          <button className="admin-refresh" onClick={carregar} disabled={loading}>
            <i className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`} /> 
              Atualizar
          </button>
      </div>
      <div className="moderation-summary">
        <span className="moderation-summary-icon">
          <i className="fa fa-inbox" />
        </span>
        <div>
          <strong>{loading ? '…' : posts.length}</strong>
          <span>{posts.length === 1 ? 'post pendente' : 'posts pendentes'}</span>
        </div>
      </div>
      {feedback && <div role="status" className="admin-alert success">{feedback}</div>}
      {erro && <div role="alert" className="admin-alert error">{erro}</div>}
      {loading ? <div role="status" className="admin-empty"><i className="fa fa-circle-o-notch fa-spin" /><p>Carregando publicações pendentes…</p></div> : posts.length === 0 ? <div className="admin-empty"><i className="fa fa-check-circle-o" /><h2>Tudo em dia</h2><p>Não há publicações aguardando análise.</p></div> : <div className="moderation-list">{posts.map(post => <PostPendente key={post.idPost} post={post} onAction={agir} busy={busyId === post.idPost} />)}</div>}
    </section>
  );
}
