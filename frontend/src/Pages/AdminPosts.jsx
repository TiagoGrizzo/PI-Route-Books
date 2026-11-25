import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL, AprovarPost, CancelarPost, getpostsPendentes } from '../api/Route-book.jsx';

const campo = (post, ...keys) => keys.map(key => post?.[key]).find(value => value !== undefined && value !== null && value !== '') || '';

const imagens = post => {
  try {
    const lista = JSON.parse(post.imagensJson || '[]');
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
};

const urlImagem = value => value?.startsWith('http') ? value : `${API_BASE_URL}${value?.startsWith('/') ? '' : '/'}${value}`;

function formatarDataHora(valor) {
  if (!valor) return 'Data não informada';

  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? 'Data não informada' : valor.toLocaleString('pt-BR');
  }

  const texto = String(valor).trim();
  if (!texto) return 'Data não informada';

  // Se vier ISO sem fuso (ex: 2026-11-24T22:50:00), interpreta como horário local
  const isoSemOffset = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d+)?$/;
  const dataObj = isoSemOffset.test(texto)
    ? new Date(texto.replace(' ', 'T'))
    : new Date(texto);

  if (Number.isNaN(dataObj.getTime())) return texto;

  return dataObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function PostPendente({ post, onAction, busy }) {
  const titulo = campo(post, 'titulo', 'Titulo') || 'Publicação sem título';
  const conteudo = campo(post, 'conteudo', 'Conteudo', 'resumo', 'Resumo');
  const media = [...new Set([...imagens(post), campo(post, 'imagemUrl', 'ImagemUrl')].filter(Boolean))];
  const autor = campo(post.autor ?? post.Autor, 'nomeCompleto', 'NomeCompleto', 'username', 'Username') || 'Aventureiro';
  const localizacao = campo(post, 'localizacao', 'Localizacao');
  const data = campo(
    post,
    'dataCriacao',
    'DataCriacao',
    'criadoEm',
    'CriadoEm',
    'dataPostagem',
    'DataPostagem',
    'createdAt',
    'CreatedAt'
  );

  return (
    <article className="moderation-card">
      <header className="moderation-card-header">
        <div className="moderation-author">
          <span
            className="moderation-avatar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <i className="fa fa-user" aria-hidden="true" style={{ lineHeight: 1, margin: 0 }} />
          </span>
          <div>
            <strong>{autor}</strong>
            <small>{formatarDataHora(data)}</small>
          </div>
        </div>
        <span className="pending-badge"><i className="fa fa-clock-o" /> Aguardando análise</span>
      </header>
      <div className="moderation-content">
        <h2>{titulo}</h2>
        {localizacao && <p className="moderation-location"><i className="fa fa-map-marker" /> {localizacao}</p>}
        <p className="moderation-text">{conteudo || 'Esta publicação não possui texto.'}</p>
        {media.length > 0 && (
          <div className="moderation-media">
            {media.map((src, i) => (
              post.tipoMidia === 'video'
                ? <video key={src} controls src={urlImagem(src)} aria-label={`Vídeo do post ${i + 1}`} />
                : <img key={src} src={urlImagem(src)} alt={`Mídia da publicação ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
      <footer className="moderation-actions">
        <span>Confira texto e mídia antes de decidir.</span>
        <div>
          <button className="moderation-button reject" disabled={busy} onClick={() => onAction(post.idPost, 'cancelar')}>
            <i className="fa fa-times" /> Cancelar post
          </button>
          <button className="moderation-button approve" disabled={busy} onClick={() => onAction(post.idPost, 'aprovar')}>
            <i className="fa fa-check" /> Aprovar post
          </button>
        </div>
      </footer>
    </article>
  );
}

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busyId, setBusyId] = useState(null);

  const carregar = useCallback(() => {
    setLoading(true);
    setErro('');
    getpostsPendentes()
      .then(r => setPosts(Array.isArray(r.data) ? r.data : []))
      .catch(e => setErro(e.response?.data?.mensagem || 'Não foi possível carregar os posts pendentes.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const agir = async (id, acao) => {
    setBusyId(id);
    setFeedback('');
    setErro('');
    try {
      const resposta = acao === 'aprovar' ? await AprovarPost(id) : await CancelarPost(id);
      setPosts(lista => lista.filter(post => post.idPost !== id));
      setFeedback(resposta.data?.mensagem || (acao === 'aprovar' ? 'Post aprovado.' : 'Post cancelado.'));
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Não foi possível concluir a moderação.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CONTEÚDO DA COMUNIDADE</span>
          <h1>Gerência de posts</h1>
          <p>Revise as publicações antes que sejam exibidas no feed.</p>
        </div>
        <button
          type="button"
          className="admin-refresh"
          onClick={carregar}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <i
            className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`}
            aria-hidden="true"
            style={{ lineHeight: 1, margin: 0 }}
          />
          <span>Atualizar</span>
        </button>
      </div>
      <div className="moderation-summary">
        <span
          className="moderation-summary-icon"
          style={{
            width: '44px',
            height: '44px',
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className="fa fa-inbox" aria-hidden="true" style={{ lineHeight: 1, margin: 0 }} />
        </span>
        <div>
          <strong>{loading ? '…' : posts.length}</strong>
          <span>{posts.length === 1 ? 'post pendente' : 'posts pendentes'}</span>
        </div>
      </div>
      {feedback && <div role="status" className="admin-alert success">{feedback}</div>}
      {erro && <div role="alert" className="admin-alert error">{erro}</div>}
      {loading
        ? <div role="status" className="admin-empty"><i className="fa fa-circle-o-notch fa-spin" /><p>Carregando publicações pendentes…</p></div>
        : posts.length === 0
          ? <div className="admin-empty"><i className="fa fa-check-circle-o" /><h2>Tudo em dia</h2><p>Não há publicações aguardando análise.</p></div>
          : <div className="moderation-list">{posts.map(post => <PostPendente key={post.idPost} post={post} onAction={agir} busy={busyId === post.idPost} />)}</div>}
    </section>
  );
}