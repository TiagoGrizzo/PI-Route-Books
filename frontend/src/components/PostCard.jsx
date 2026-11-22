import VerifiedBadge from './VerifiedBadge.jsx';
import PostMediaGallery from './PostMediaGallery.jsx';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { deletePost, getCreatePostData, getPostById, updatePost, votarPost } from '../api/Route-book.jsx';
import { dataRelativa, iniciais, lerSalvos, salvarIds, urlDaApi } from './postUtils.js';

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

export function Avatar({ pessoa, small = false }) {
  const nome = pessoa?.nomeCompleto || pessoa?.username || 'Aventureiro';
  return pessoa?.fotoPerfil
    ? <img className={'feed-avatar feed-avatar-photo' + (small ? ' feed-avatar-small' : '')} src={urlDaApi(pessoa.fotoPerfil)} alt="" />
    : <span className={'feed-avatar' + (small ? ' feed-avatar-small' : '')}>{iniciais(nome)}</span>;
}

export function PostVotes({ post, onChange, horizontal = false }) {
  const navigate = useNavigate();
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState('');
  const [animacao, setAnimacao] = useState(false);

  const votar = async valor => {
    if (!localStorage.getItem('UsuarioId')) { navigate('/login'); return; }
    if (lock.current) return;
    const novo = post.meuVoto === valor ? 0 : valor;
    lock.current = true; setBusy(true); setErro('');
    try {
      const res = await votarPost(post.idPost, novo);
      onChange(res.data);
      if (novo === 1) setAnimacao(true);
    } catch (e) { setErro(e.response?.data?.mensagem || 'Não foi possível votar. Tente novamente.'); }
    finally { lock.current = false; setBusy(false); }
  };

  return (
    <div className={'post-votes' + (horizontal ? ' horizontal' : '')} role="group" aria-label="Votos da publicação">
      <button type="button" disabled={busy} onClick={() => votar(1)} aria-label={post.meuVoto === 1 ? 'Remover curtida' : 'Curtir publicação'} aria-pressed={post.meuVoto === 1} className={'post-upvote' + (post.meuVoto === 1 ? ' selected' : '') + (animacao ? ' takeoff' : '')} onAnimationEnd={() => setAnimacao(false)}>
        <i className="fa fa-plane" aria-hidden="true" />
      </button>
      <span className="vote-count" aria-label={(post.curtidasCount || 0) + ' curtidas'}>{post.curtidasCount || 0}<small>curtidas</small></span>
      <button type="button" disabled={busy} onClick={() => votar(-1)} aria-label={post.meuVoto === -1 ? 'Remover downvote' : 'Dar downvote'} aria-pressed={post.meuVoto === -1} className={'post-downvote' + (post.meuVoto === -1 ? ' selected' : '')}>
        <i className="fa fa-arrow-down" aria-hidden="true" />
      </button>
      <span className="vote-count down-count" aria-label={(post.downvotesCount || 0) + ' downvotes'}>{post.downvotesCount || 0}<small>downvotes</small></span>
      {erro && <span className="vote-error" role="alert">{erro}</span>}
    </div>
  );
}

export function PostActions({ post, ehDono, onAbrirEditar, onSolicitarExcluir, excluindo, children }) {
  const navigate = useNavigate();
  const postIdNum = Number(post.idPost);
  const [salvo, setSalvo] = useState(() => lerSalvos().includes(postIdNum));
  const [mensagem, setMensagem] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const sincronizar = () => setSalvo(lerSalvos().includes(postIdNum));
    sincronizar();
    window.addEventListener('routebooks-salvos', sincronizar);
    window.addEventListener('storage', sincronizar);
    return () => {
      window.removeEventListener('routebooks-salvos', sincronizar);
      window.removeEventListener('storage', sincronizar);
    };
  }, [postIdNum]);

  useEffect(() => {
    if (!menuAberto) return;
    const fecharAoClicarFora = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    const fecharComEsc = e => {
      if (e.key === 'Escape') setMenuAberto(false);
    };
    document.addEventListener('mousedown', fecharAoClicarFora);
    window.addEventListener('keydown', fecharComEsc);
    return () => {
      document.removeEventListener('mousedown', fecharAoClicarFora);
      window.removeEventListener('keydown', fecharComEsc);
    };
  }, [menuAberto]);

  const salvar = () => {
    const uid = Number(localStorage.getItem('UsuarioId')) || null;
    if (!uid) {
      navigate('/login');
      return;
    }
    const ids = lerSalvos(uid);
    const novo = !ids.includes(postIdNum);
    const atualizados = novo ? [...ids, postIdNum] : ids.filter(id => id !== postIdNum);
    salvarIds(atualizados, uid);
    setSalvo(novo);
    window.dispatchEvent(new Event('routebooks-salvos'));
  };

  const compartilhar = async () => {
    try {
      const url = window.location.origin + '/posts/detalhes/' + post.idPost;
      if (navigator.share) await navigator.share({ title: post.titulo, url });
      else { await navigator.clipboard.writeText(url); setMensagem('Link copiado.'); }
    } catch (e) { if (e.name !== 'AbortError') setMensagem('Não foi possível compartilhar.'); }
  };

  return (
    <>
      <div className="feed-post-actions" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        {children}
        <Link to={'/posts/detalhes/' + post.idPost + '#comentarios'}><i className="fa fa-comment-o" aria-hidden="true" /> {post.comentariosCount || 0} Comentários</Link>
        <button type="button" onClick={compartilhar}><i className="fa fa-retweet" aria-hidden="true" /> Compartilhar</button>
        <button type="button" onClick={salvar} aria-pressed={salvo}>
          <i className={'fa ' + (salvo ? 'fa-bookmark' : 'fa-bookmark-o')} aria-hidden="true" /> {salvo ? 'Salvo' : 'Salvar'}
        </button>

        {ehDono && (
          <div ref={menuRef} style={{ position: 'relative', marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={() => setMenuAberto(aberto => !aberto)}
              aria-label="Mais opções da publicação"
              aria-expanded={menuAberto}
              aria-haspopup="menu"
              title="Mais opções"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: menuAberto ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: menuAberto ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid transparent',
                cursor: 'pointer'
              }}
            >
              <i className="fa fa-ellipsis-v" aria-hidden="true" />
            </button>

            {menuAberto && (
              <div
                role="menu"
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 'calc(100% + 6px)',
                  minWidth: '175px',
                  backgroundColor: '#0f291e',
                  border: '1px solid #2e523b',
                  borderRadius: '12px',
                  padding: '6px',
                  boxShadow: '0 14px 32px rgba(0, 0, 0, 0.55)',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuAberto(false);
                    navigate(`/perfil/${post.usuariosIdUsuario}?aba=estatisticas`);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 0,
                    background: 'transparent',
                    color: '#edf4eb',
                    fontSize: '13.5px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ width: '18px', display: 'inline-flex', justifyContent: 'center', flexShrink: 0, color: '#cbd5e1' }}>
                    <i className="fa fa-bar-chart" aria-hidden="true" />
                  </span>
                  Estatísticas
                </button>

                <button
                  type="button"
                  role="menuitem"
                  disabled={excluindo}
                  onClick={() => {
                    setMenuAberto(false);
                    onAbrirEditar?.();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 0,
                    background: 'transparent',
                    color: '#edf4eb',
                    fontSize: '13.5px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ width: '18px', display: 'inline-flex', justifyContent: 'center', flexShrink: 0, color: '#cbd5e1' }}>
                    <i className="fa fa-pencil" aria-hidden="true" />
                  </span>
                  Editar
                </button>

                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '3px 6px' }} />

                <button
                  type="button"
                  role="menuitem"
                  disabled={excluindo}
                  onClick={() => {
                    setMenuAberto(false);
                    onSolicitarExcluir?.();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 0,
                    background: 'transparent',
                    color: '#ff6b81',
                    fontSize: '13.5px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 107, 129, 0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ width: '18px', display: 'inline-flex', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fa fa-trash-o" aria-hidden="true" />
                  </span>
                  {excluindo ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {mensagem && <p className="post-action-status" role="status">{mensagem}</p>}
    </>
  );
}

export function PostMedia({ post, detail = false }) { return <PostMediaGallery post={post} detail={detail} />; }

export function PostTags({ post }) {
  const estrelas = post.avaliacaoLugar != null ? Math.round(Number(post.avaliacaoLugar)) : 0;

  return (
    <div className="feed-post-tags">
      {post.localizacao && <span><i className="fa fa-map-marker" aria-hidden="true" /> {post.localizacao}</span>}
      {estrelas >= 1 && estrelas <= 5 && (
        <span className="feed-rating-tag" aria-label={`${estrelas} de 5 estrelas`}>
          {[1, 2, 3, 4, 5].map(n => (
            <i
              key={n}
              className={`fa ${n <= estrelas ? 'fa-star' : 'fa-star-o'}`}
              aria-hidden="true"
              style={{ color: n <= estrelas ? '#facc15' : '#94a3b8' }}
            />
          ))}
        </span>
      )}
      {post.categoriaRef?.nome && <span>{post.categoriaRef.nome}</span>}
      {post.tipoRef?.nomeTipo && <span>{post.tipoRef.nomeTipo}</span>}
    </div>
  );
}

export default function PostCard({ post, onChange, onDelete }) {
  const uid = Number(localStorage.getItem('UsuarioId')) || 0;
  const ehDono = uid > 0 && Number(post.usuariosIdUsuario) === uid;
  const autor = post.autor?.nomeCompleto || post.autor?.username || 'Aventureiro';

  const [editando, setEditando] = useState(false);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState('');

  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroAcao, setErroAcao] = useState('');

  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [formEdicao, setFormEdicao] = useState({
    titulo: post.titulo || '',
    resumo: post.resumo || '',
    conteudo: post.conteudo || '',
    localizacao: post.localizacao || '',
    avaliacaoLugar: post.avaliacaoLugar ? Math.round(Number(post.avaliacaoLugar)) : 0,
    tiposIdTipo: post.tiposIdTipo ?? '',
    categoriasIdCategoria: post.categoriasIdCategoria ?? ''
  });

  useEffect(() => {
    if (!editando) return;
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

  const abrirEditar = () => {
    if (!ehDono) return;
    setErroAcao('');
    setEditando(true);
  };

  const solicitarExcluir = () => {
    if (!ehDono || excluindo) return;
    setErroAcao('');
    setConfirmandoExclusao(true);
  };

  const confirmarExcluir = async () => {
    if (!ehDono || excluindo) return;
    setExcluindo(true);
    setErroAcao('');
    try {
      await deletePost(post.idPost);
      setConfirmandoExclusao(false);
      onDelete?.(post.idPost);
      emitirToast('Publicação excluída', 'Seu post foi excluído permanentemente.', 'sucesso');
    } catch (e) {
      setConfirmandoExclusao(false);
      setErroAcao(e.response?.data?.mensagem || 'Não foi possível excluir a publicação.');
    } finally {
      setExcluindo(false);
    }
  };

  const salvarEdicao = async e => {
    e.preventDefault();
    if (!ehDono || salvandoEdicao) return;
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

      let postMesclado = {
        ...post,
        ...atualizado,
        autor: atualizado.autor && (atualizado.autor.nomeCompleto || atualizado.autor.username)
          ? { ...post.autor, ...atualizado.autor }
          : post.autor,
        avaliacaoLugar: atualizado.avaliacaoLugar ?? avaliacaoNum,
        categoriaRef: categoriaObj ? { id: categoriaObj.id, nome: categoriaObj.nome } : post.categoriaRef,
        tipoRef: tipoObj ? { idTipo: tipoObj.id, nomeTipo: tipoObj.nome } : post.tipoRef
      };

      try {
        const fresh = await getPostById(post.idPost);
        if (fresh?.data) {
          postMesclado = {
            ...postMesclado,
            ...fresh.data,
            autor: fresh.data.autor && (fresh.data.autor.nomeCompleto || fresh.data.autor.username)
              ? fresh.data.autor
              : postMesclado.autor
          };
        }
      } catch {
        // Mantém atualização local se a busca de confirmação falhar
      }

      onChange?.(postMesclado);
      setEditando(false);
      emitirToast('Alterações salvas', 'Alterações salvas com sucesso.', 'sucesso');
    } catch (e) {
      setErroEdicao(e.response?.data?.mensagem || 'Não foi possível salvar as alterações.');
    } finally {
      setSalvandoEdicao(false);
    }
  };

  const modalExclusao = confirmandoExclusao && ehDono
    ? createPortal(
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
    )
    : null;

  const modalEdicao = editando && ehDono
    ? createPortal(
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
    )
    : null;

  return (
    <>
      <article className="feed-post-card">
        <div className="feed-post-rail"><PostVotes post={post} onChange={changes => onChange?.({ ...post, ...changes })} /></div>
        <div className="feed-post-content">
          <div className="feed-post-author-row">
            <Link to={'/perfil/' + post.usuariosIdUsuario}><Avatar pessoa={post.autor} small /></Link>
            <div>
              <Link to={'/posts/detalhes/' + post.idPost} className="feed-post-heading">{post.titulo}</Link>
              <span> · Postado por <Link to={'/perfil/' + post.usuariosIdUsuario}>{autor}<VerifiedBadge pessoa={post.autor} /></Link> · {dataRelativa(post.dataCriacao)}</span>
            </div>
          </div>
          <PostTags post={post} />
          <p className="feed-post-summary">{post.resumo || post.conteudo}</p>
          <PostMedia post={post} />
          {!post.imagemUrl && <Link className="post-read-more" to={'/posts/detalhes/' + post.idPost}>Ler relato completo <i className="fa fa-arrow-right" aria-hidden="true" /></Link>}
          <PostActions
            post={post}
            ehDono={ehDono}
            onAbrirEditar={abrirEditar}
            onSolicitarExcluir={solicitarExcluir}
            excluindo={excluindo}
          />
          {erroAcao && <p className="post-action-status" role="alert">{erroAcao}</p>}
        </div>
      </article>

      {modalExclusao}
      {modalEdicao}
    </>
  );
}