import VerifiedBadge from '../components/VerifiedBadge.jsx';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  comentarPost,
  deletePost,
  getComentarios,
  getCreatePostData,
  getPostById,
  getUsuariosSeguidos,
  seguirUsuario,
  deixarDeSeguirUsuario,
  updatePost
} from '../api/Route-book.jsx';
import FeedLayout from '../components/FeedLayout.jsx';
import { Avatar, PostActions, PostMedia, PostTags, PostVotes } from '../components/PostCard.jsx';
import { dataRelativa } from '../components/postUtils.js';

const OVERLAY_MODAL_STYLE = {
  position: 'fixed',
  inset: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.78)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  zIndex: 2147483647,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px'
};

function emitirToast(titulo, mensagem, tipo = 'sucesso') {
  window.dispatchEvent(
    new CustomEvent('routebooks-toast', {
      detail: { titulo, mensagem, tipo }
    })
  );
}

export default function PostDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const uid = Number(localStorage.getItem('UsuarioId')) || null;

  const [post, setPost] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [erro, setErro] = useState('');
  const [erroComentarios, setErroComentarios] = useState('');
  const [loading, setLoading] = useState(true);
  const [tentativa, setTentativa] = useState(0);
  const [texto, setTexto] = useState('');
  const [resposta, setResposta] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [ordem, setOrdem] = useState('recentes');
  const [seguindo, setSeguindo] = useState(false);
  const [ocupado, setOcupado] = useState(false);

  const [editando, setEditando] = useState(false);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState('');
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [formEdicao, setFormEdicao] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    localizacao: '',
    avaliacaoLugar: 0,
    tiposIdTipo: '',
    categoriasIdCategoria: ''
  });

  const textarea = useRef(null);
  const envio = useRef(false);

  const ehDono = Boolean(uid && post && Number(post.usuariosIdUsuario) === Number(uid));

  useEffect(() => {
    let ativo = true; setLoading(true); setErro(''); setTexto(''); setResposta(null); setComentarios([]); setErroComentarios('');
    getPostById(id)
      .then(r => { if (ativo) setPost(r.data); })
      .catch(e => { if (ativo) setErro(e.response?.status === 404 ? 'Publicação não encontrada.' : 'Não foi possível carregar a publicação.'); })
      .finally(() => { if (ativo) setLoading(false); });
    getComentarios(id)
      .then(r => { if (ativo) setComentarios(r.data); })
      .catch(() => { if (ativo) setErroComentarios('Não foi possível carregar os comentários.'); });
    return () => { ativo = false; };
  }, [id, tentativa]);

  useEffect(() => {
    let ativo = true;
    if (uid && post?.usuariosIdUsuario) {
      getUsuariosSeguidos()
        .then(r => { if (ativo) setSeguindo(Array.isArray(r.data) && r.data.includes(post.usuariosIdUsuario)); })
        .catch(() => {});
    }
    return () => { ativo = false; };
  }, [uid, post?.usuariosIdUsuario]);

  useEffect(() => {
    if (!editando || !post) return;
    setFormEdicao({
      titulo: post.titulo || '',
      resumo: post.resumo || '',
      conteudo: post.conteudo || '',
      localizacao: post.localizacao || '',
      avaliacaoLugar: post.avaliacaoLugar ? Math.round(Number(post.avaliacaoLugar)) : 0,
      tiposIdTipo: post.tiposIdTipo ?? '',
      categoriasIdCategoria: post.categoriasIdCategoria ?? ''
    });
    setErroEdicao('');

    if (!categorias.length || !tipos.length) {
      getCreatePostData()
        .then(res => {
          setCategorias(Array.isArray(res.data?.categorias) ? res.data.categorias : []);
          setTipos(Array.isArray(res.data?.tipos) ? res.data.tipos : []);
        })
        .catch(() => {});
    }
  }, [editando, post, categorias.length, tipos.length]);

  useEffect(() => {
    if (!editando && !confirmandoExclusao) return;
    const onKeyDown = e => {
      if (e.key === 'Escape') {
        if (!salvandoEdicao) setEditando(false);
        if (!excluindo) setConfirmandoExclusao(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editando, confirmandoExclusao, salvandoEdicao, excluindo]);

  const seguir = async () => {
    if (ocupado) return; setOcupado(true); setErroComentarios('');
    try { if (seguindo) await deixarDeSeguirUsuario(post.usuariosIdUsuario); else await seguirUsuario(post.usuariosIdUsuario); setSeguindo(!seguindo); }
    catch { setErroComentarios('Não foi possível atualizar quem você segue.'); }
    finally { setOcupado(false); }
  };

  const comentar = async event => {
    event.preventDefault(); if (envio.current || !texto.trim()) return;
    envio.current = true; setEnviando(true); setErroComentarios('');
    try {
      await comentarPost(id, { conteudo: texto.trim(), respostaId: resposta?.idComentario || null });
      setTexto(''); setResposta(null);
      setPost(p => ({ ...p, comentariosCount: (p.comentariosCount || 0) + 1 }));
      try { const res = await getComentarios(id); setComentarios(res.data); }
      catch { setErroComentarios('Comentário enviado. Recarregue a lista para vê-lo.'); }
    } catch (e) { setErroComentarios(e.response?.data?.mensagem || 'Não foi possível comentar. Seu texto foi mantido.'); }
    finally { envio.current = false; setEnviando(false); }
  };

  const responder = c => { setResposta(c); textarea.current?.focus(); };

  const confirmarExcluir = async () => {
    if (!ehDono || excluindo || !post) return;
    setExcluindo(true);
    try {
      await deletePost(post.idPost);
      setConfirmandoExclusao(false);
      emitirToast('Publicação excluída', 'Seu post foi excluído permanentemente.', 'sucesso');
      navigate('/posts', { replace: true });
    } catch (e) {
      setConfirmandoExclusao(false);
      setErro(e.response?.data?.mensagem || 'Não foi possível excluir a publicação.');
    } finally {
      setExcluindo(false);
    }
  };

  const salvarEdicao = async e => {
    e.preventDefault();
    if (!ehDono || salvandoEdicao || !post) return;
    setErroEdicao('');

    if (!formEdicao.titulo.trim() || !formEdicao.conteudo.trim()) {
      setErroEdicao('Preencha o título e o relato da viagem.');
      return;
    }

    const estrelasSelecionadas = Number(formEdicao.avaliacaoLugar) || 0;
    const avaliacaoNum = estrelasSelecionadas >= 1 && estrelasSelecionadas <= 5 ? estrelasSelecionadas : null;

    setSalvandoEdicao(true);
    try {
      const payload = {
        idPost: Number(post.idPost),
        titulo: formEdicao.titulo.trim(),
        resumo: formEdicao.resumo.trim() || null,
        conteudo: formEdicao.conteudo.trim(),
        localizacao: formEdicao.localizacao.trim() || null,
        avaliacaoLugar: avaliacaoNum,
        tiposIdTipo: formEdicao.tiposIdTipo ? Number(formEdicao.tiposIdTipo) : null,
        categoriasIdCategoria: formEdicao.categoriasIdCategoria ? Number(formEdicao.categoriasIdCategoria) : null
      };

      const res = await updatePost(post.idPost, payload);
      const atualizado = res.data?.post || payload;
      const categoriaObj = categorias.find(c => Number(c.id) === Number(atualizado.categoriasIdCategoria));
      const tipoObj = tipos.find(t => Number(t.id) === Number(atualizado.tiposIdTipo));

      setPost(prev => ({
        ...prev,
        ...atualizado,
        autor: atualizado.autor && (atualizado.autor.nomeCompleto || atualizado.autor.username)
          ? { ...prev.autor, ...atualizado.autor }
          : prev.autor,
        avaliacaoLugar: atualizado.avaliacaoLugar ?? avaliacaoNum,
        categoriaRef: categoriaObj ? { id: categoriaObj.id, nome: categoriaObj.nome } : prev.categoriaRef,
        tipoRef: tipoObj ? { idTipo: tipoObj.id, nomeTipo: tipoObj.nome } : prev.tipoRef
      }));

      try {
        const fresh = await getPostById(post.idPost);
        if (fresh?.data) {
          setPost(prev => ({
            ...prev,
            ...fresh.data,
            autor: fresh.data.autor && (fresh.data.autor.nomeCompleto || fresh.data.autor.username)
              ? fresh.data.autor
              : prev.autor
          }));
        }
      } catch {
        // Mantém a atualização local se o GET de confirmação falhar
      }

      setEditando(false);
      emitirToast('Alterações salvas', 'Alterações salvas com sucesso.', 'sucesso');
    } catch (e) {
      setErroEdicao(e.response?.data?.mensagem || 'Não foi possível salvar as alterações.');
    } finally {
      setSalvandoEdicao(false);
    }
  };

  const renderComentario = (c, filho = false) => (
    <article className={'detail-comment' + (filho ? ' reply' : '')} key={c.idComentario}>
      <Link to={'/perfil/' + c.autor.idUsuario}><Avatar pessoa={c.autor} small /></Link>
      <div>
        <div className="comment-byline">
          <Link to={'/perfil/' + c.autor.idUsuario}>{c.autor.nomeCompleto || c.autor.username}<VerifiedBadge pessoa={c.autor} /></Link>
          <small> · {dataRelativa(c.criadoEm)}</small>
        </div>
        <p>{c.conteudo}</p>
        {uid && <button type="button" onClick={() => responder(filho ? comentarios.find(p => p.idComentario === c.respostaId) : c)}>Responder</button>}
        {!filho && comentarios.filter(r => r.respostaId === c.idComentario).map(r => renderComentario(r, true))}
      </div>
    </article>
  );

  const principais = comentarios
    .filter(c => !c.respostaId)
    .sort((a, b) => ordem === 'recentes' ? new Date(b.criadoEm) - new Date(a.criadoEm) : new Date(a.criadoEm) - new Date(b.criadoEm));

  return (
    <>
      <FeedLayout>
        <Link className="social-back" to="/posts"><i className="fa fa-arrow-left" aria-hidden="true" /> Voltar aos relatos</Link>
        {loading ? (
          <div className="feed-state-card">Carregando publicação...</div>
        ) : erro ? (
          <div className="feed-state-card" role="alert"><p>{erro}</p><button onClick={() => setTentativa(n => n + 1)}>Tentar novamente</button></div>
        ) : post && (
          <>
            <article className="detail-post">
              <header className="detail-author">
                <Link to={'/perfil/' + post.usuariosIdUsuario}><Avatar pessoa={post.autor} /></Link>
                <div>
                  <Link to={'/perfil/' + post.usuariosIdUsuario}><strong>{post.autor?.nomeCompleto || 'Aventureiro'}<VerifiedBadge pessoa={post.autor} /></strong></Link>
                  <small>@{post.autor?.username || 'viajante'} · {dataRelativa(post.dataCriacao)}</small>
                </div>
                {uid !== post.usuariosIdUsuario && (
                  uid
                    ? <button className="social-green-button" disabled={ocupado} onClick={seguir}>{seguindo ? 'Seguindo' : 'Seguir'}</button>
                    : <Link className="social-green-button" to="/login">Seguir</Link>
                )}
              </header>
              <h1>{post.titulo}</h1>
              <PostTags post={post} />
              <p className="detail-story">{post.conteudo || post.resumo}</p>
              <PostMedia post={post} detail />
              <PostActions
                key={post.idPost}
                post={post}
                ehDono={ehDono}
                onAbrirEditar={() => setEditando(true)}
                onSolicitarExcluir={() => setConfirmandoExclusao(true)}
                excluindo={excluindo}
              >
                <PostVotes post={post} horizontal onChange={v => setPost(p => ({ ...p, ...v }))} />
              </PostActions>
            </article>

            <section id="comentarios" className="detail-comment-composer">
              {uid ? (
                <form onSubmit={comentar}>
                  <label htmlFor="novo-comentario">Comentar como <strong>{localStorage.getItem('NomeUsuario') || 'aventureiro'}</strong></label>
                  {resposta && <p className="reply-label">Respondendo a {resposta.autor.nomeCompleto}<button type="button" onClick={() => setResposta(null)}>Cancelar</button></p>}
                  <textarea id="novo-comentario" ref={textarea} value={texto} onChange={e => setTexto(e.target.value)} maxLength={3000} rows={3} required placeholder="Participe da conversa..." disabled={enviando} />
                  <div className="comment-submit"><small>{texto.length}/3000</small><button className="social-green-button" disabled={enviando || !texto.trim()}>{enviando ? 'Enviando...' : 'Comentar'}</button></div>
                </form>
              ) : (
                <p><Link to="/login">Entre na sua conta</Link> para participar da conversa.</p>
              )}
            </section>

            {erroComentarios && (
              <p className="feed-toast" role="alert">
                {erroComentarios} <button onClick={() => getComentarios(id).then(r => { setComentarios(r.data); setErroComentarios(''); }).catch(() => {})}>Recarregar comentários</button>
              </p>
            )}

            <div className="comments-heading">
              <h2>Comentários ({post.comentariosCount || 0})</h2>
              <label>Ordenar por: <select value={ordem} onChange={e => setOrdem(e.target.value)}><option value="recentes">Mais recentes</option><option value="antigos">Mais antigos</option></select></label>
            </div>

            <div className="detail-comments">
              {principais.map(c => renderComentario(c))}
              {!comentarios.length && !erroComentarios && <p className="feed-side-empty">Seja o primeiro a comentar esta aventura.</p>}
            </div>
          </>
        )}
      </FeedLayout>

      {confirmandoExclusao && ehDono && createPortal(
        <div
          onClick={() => !excluindo && setConfirmandoExclusao(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
          style={OVERLAY_MODAL_STYLE}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#102d21',
              border: '1px solid #2e523b',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '410px',
              padding: '22px',
              color: '#edf4eb',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)'
            }}
          >
            <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem' }}>Deseja realmente excluir essa publicação?</h3>
            <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#b7c9be', lineHeight: 1.5 }}>
              Essa ação não poderá ser desfeita.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setConfirmandoExclusao(false)}
                disabled={excluindo}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid #6b7280',
                  backgroundColor: '#4b5563',
                  color: '#f9fafb',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarExcluir}
                disabled={excluindo}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: 0,
                  backgroundColor: '#00fa85',
                  color: '#062114',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                {excluindo ? 'Confirmando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {editando && ehDono && createPortal(
        <div
          onClick={() => !salvandoEdicao && setEditando(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Editar publicação"
          style={OVERLAY_MODAL_STYLE}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#102d21',
              border: '1px solid #2e523b',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '540px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '22px',
              color: '#edf4eb',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Editar publicação</h3>
              <button
                type="button"
                onClick={() => setEditando(false)}
                disabled={salvandoEdicao}
                aria-label="Fechar edição"
                style={{ background: 'transparent', border: 0, color: '#cbd5e1', fontSize: '18px', cursor: 'pointer' }}
              >
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={salvarEdicao} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                Título
                <input
                  type="text"
                  value={formEdicao.titulo}
                  maxLength={150}
                  required
                  onChange={e => setFormEdicao(f => ({ ...f, titulo: e.target.value }))}
                  style={{ padding: '9px 10px', borderRadius: '8px', border: '1px solid #527b5d', background: '#0b2018', color: '#edf4eb' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                Resumo
                <input
                  type="text"
                  value={formEdicao.resumo}
                  maxLength={300}
                  onChange={e => setFormEdicao(f => ({ ...f, resumo: e.target.value }))}
                  style={{ padding: '9px 10px', borderRadius: '8px', border: '1px solid #527b5d', background: '#0b2018', color: '#edf4eb' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                Relato da viagem
                <textarea
                  rows={4}
                  value={formEdicao.conteudo}
                  required
                  onChange={e => setFormEdicao(f => ({ ...f, conteudo: e.target.value }))}
                  style={{ padding: '9px 10px', borderRadius: '8px', border: '1px solid #527b5d', background: '#0b2018', color: '#edf4eb', resize: 'vertical' }}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                  Localização
                  <input
                    type="text"
                    value={formEdicao.localizacao}
                    maxLength={180}
                    onChange={e => setFormEdicao(f => ({ ...f, localizacao: e.target.value }))}
                    style={{ padding: '9px 10px', borderRadius: '8px', border: '1px solid #527b5d', background: '#0b2018', color: '#edf4eb' }}
                  />
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                  <span>Avaliação</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingTop: '4px' }} role="group" aria-label="Avaliação em estrelas">
                    {[1, 2, 3, 4, 5].map(nota => {
                      const ativa = nota <= (Number(formEdicao.avaliacaoLugar) || 0);
                      return (
                        <button
                          key={nota}
                          type="button"
                          onClick={() => setFormEdicao(f => ({ ...f, avaliacaoLugar: nota }))}
                          aria-label={`${nota} ${nota === 1 ? 'estrela' : 'estrelas'}`}
                          style={{
                            background: 'transparent',
                            border: 0,
                            padding: '2px',
                            cursor: 'pointer',
                            fontSize: '17px',
                            color: ativa ? '#facc15' : '#64748b'
                          }}
                        >
                          <i className={`fa ${ativa ? 'fa-star' : 'fa-star-o'}`} aria-hidden="true" />
                        </button>
                      );
                    })}
                    {(Number(formEdicao.avaliacaoLugar) || 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => setFormEdicao(f => ({ ...f, avaliacaoLugar: 0 }))}
                        title="Remover avaliação"
                        style={{
                          background: 'transparent',
                          border: 0,
                          color: '#94a3b8',
                          fontSize: '11.5px',
                          marginLeft: '4px',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!!tipos.length && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                  Tipo de viagem
                  <select
                    value={formEdicao.tiposIdTipo}
                    onChange={e => setFormEdicao(f => ({ ...f, tiposIdTipo: e.target.value }))}
                    style={{ padding: '9px 10px', borderRadius: '8px', border: '1px solid #527b5d', background: '#0b2018', color: '#edf4eb' }}
                  >
                    <option value="">Selecione...</option>
                    {tipos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </label>
              )}

              {!!categorias.length && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                  Categoria
                  <select
                    value={formEdicao.categoriasIdCategoria}
                    onChange={e => setFormEdicao(f => ({ ...f, categoriasIdCategoria: e.target.value }))}
                    style={{ padding: '9px 10px', borderRadius: '8px', border: '1px solid #527b5d', background: '#0b2018', color: '#edf4eb' }}
                  >
                    <option value="">Selecione...</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </label>
              )}

              {erroEdicao && <p role="alert" style={{ margin: 0, color: '#ff6b81', fontSize: '13px' }}>{erroEdicao}</p>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setEditando(false)}
                  disabled={salvandoEdicao}
                  style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #527b5d', background: 'transparent', color: '#edf4eb', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoEdicao}
                  className="social-green-button"
                  style={{ padding: '9px 16px', borderRadius: '8px', border: 0, cursor: 'pointer' }}
                >
                  {salvandoEdicao ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}