import VerifiedBadge from '../components/VerifiedBadge.jsx';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api, {
  editarPerfil,
  getPerfilPublico,
  getPostsPerfil,
  getAventureiros,
  getUsuariosSeguidos,
  seguirUsuario,
  deixarDeSeguirUsuario
} from '../api/Route-book.jsx';
import ProfilePhotoInput from '../components/ProfilePhotoInput.jsx';
import FeedLayout from '../components/FeedLayout.jsx';
import PostCard, { Avatar } from '../components/PostCard.jsx';
import { iniciais, urlDaApi } from '../components/postUtils.js';
import GraficoDestinos from '../components/GraficosDestinos.jsx';

const ABAS_VALIDAS = ['posts', 'midias', 'roteiros', 'curtidas', 'estatisticas'];

function normalizarListaUsuarios(data) {
  if (!data) return [];
  const lista = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.usuarios)
        ? data.usuarios
        : Array.isArray(data?.seguidores)
          ? data.seguidores
          : Array.isArray(data?.seguindo)
            ? data.seguindo
            : [];

  return lista
    .map(item => {
      const pessoa = item?.usuario || item?.seguidor || item?.seguido || item?.perfil || item;
      const idUsuario = Number(
        pessoa?.idUsuario ?? pessoa?.IdUsuario ?? pessoa?.id ?? pessoa?.Id ?? item?.usuarioId ?? item?.seguidorId ?? item?.seguidoId
      );
      if (!idUsuario) return null;

      return {
        idUsuario,
        nomeCompleto: pessoa?.nomeCompleto || pessoa?.NomeCompleto || pessoa?.nome || '',
        username: pessoa?.username || pessoa?.Username || `aventureiro${idUsuario}`,
        fotoPerfil: pessoa?.fotoPerfil || pessoa?.FotoPerfil || '',
        cidade: pessoa?.cidade || pessoa?.Cidade || '',
        uf: pessoa?.uf || pessoa?.UF || pessoa?.estado || '',
        pais: pessoa?.pais || pessoa?.Pais || ''
      };
    })
    .filter(Boolean);
}

export default function Perfil() {
  const { id: routeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const abaUrl = searchParams.get('aba');

  const uid = Number(localStorage.getItem('UsuarioId')) || null;
  const id = Number(routeId) || uid;
  const proprio = id === uid;

  const [perfil, setPerfil] = useState(null);
  const [posts, setPosts] = useState([]);
  const [aba, setAba] = useState(() => (ABAS_VALIDAS.includes(abaUrl) ? abaUrl : 'posts'));
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [erro, setErro] = useState('');
  const [erroPosts, setErroPosts] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({});
  const [erroEdicao, setErroEdicao] = useState('');
  const [ocupado, setOcupado] = useState(false);

  // Modal para visualizar foto de perfil ou banner/capa ampliada
  const [modalMidia, setModalMidia] = useState(null);

  // Modal para listar Seguindo / Seguidores
  const [modalRelacao, setModalRelacao] = useState(null);
  const [listaRelacao, setListaRelacao] = useState([]);
  const [carregandoRelacao, setCarregandoRelacao] = useState(false);
  const [erroRelacao, setErroRelacao] = useState('');
  const [filtroRelacao, setFiltroRelacao] = useState('');
  const [idsSeguidos, setIdsSeguidos] = useState(new Set());
  const [seguindoLinhaId, setSeguindoLinhaId] = useState(null);

  // Estados para controlar o Toast personalizado na tela de Perfil
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const lock = useRef(false);

  const dispararToast = (mensagem, tipo = 'success') => {
    setToast({ show: true, message: mensagem, type: tipo });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  useEffect(() => {
    if (ABAS_VALIDAS.includes(abaUrl) && abaUrl !== aba) {
      setAba(abaUrl);
    }
  }, [abaUrl, aba]);

  useEffect(() => {
    if (editando) document.querySelector('.profile-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [editando]);

  useEffect(() => {
    let ativo = true; setPerfil(null); setEditando(false); setErro(''); setLoading(true);
    if (!id) { setLoading(false); return; }
    getPerfilPublico(id)
      .then(r => { if (ativo) setPerfil(r.data); })
      .catch(() => { if (ativo) setErro('Não foi possível carregar este perfil.'); })
      .finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, [id, tentativa]);

  useEffect(() => {
    let ativo = true; setPosts([]); setErroPosts('');
    if (!id || aba === 'estatisticas') { setLoadingPosts(false); return; }
    setLoadingPosts(true);
    getPostsPerfil(id, aba)
      .then(r => { if (ativo) setPosts(r.data); })
      .catch(() => { if (ativo) setErroPosts('Não foi possível carregar as publicações.'); })
      .finally(() => { if (ativo) setLoadingPosts(false); });
    return () => { ativo = false; };
  }, [id, aba, tentativa]);

  useEffect(() => {
    if (!uid) { setIdsSeguidos(new Set()); return; }
    let ativo = true;
    getUsuariosSeguidos()
      .then(r => {
        if (!ativo) return;
        const raw = Array.isArray(r.data) ? r.data : [];
        const ids = raw
          .map(item => Number(typeof item === 'object' ? (item?.idUsuario ?? item?.id ?? item?.seguidoId) : item))
          .filter(Boolean);
        setIdsSeguidos(new Set(ids));
      })
      .catch(() => { });
    return () => { ativo = false; };
  }, [uid]);

  useEffect(() => {
    if (!modalMidia && !modalRelacao) return;
    const onKeyDown = e => {
      if (e.key === 'Escape') {
        setModalMidia(null);
        setModalRelacao(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalMidia, modalRelacao]);

  const selecionarAba = novaAba => {
    setAba(novaAba);
    setSearchParams(novaAba === 'posts' ? {} : { aba: novaAba }, { replace: true });
  };

  const editar = () => {
    setForm({ nomeCompleto: perfil.nomeCompleto || '', biografia: perfil.biografia || '', cidade: perfil.cidade || '', uf: perfil.uf || '', pais: perfil.pais || '' });
    setErroEdicao('');
    setEditando(true);
  };

  const abrirVisualizacaoAvatar = () => {
    if (!perfil) return;
    setModalMidia({
      tipo: 'avatar',
      titulo: `Foto de perfil · ${perfil.nomeCompleto || perfil.username}`,
      url: urlDaApi(perfil.fotoPerfil),
      pessoa: perfil
    });
  };

  const abrirVisualizacaoCapa = () => {
    if (!perfil?.capaUrl) return;
    setModalMidia({
      tipo: 'capa',
      titulo: `Capa do perfil · ${perfil.nomeCompleto || perfil.username}`,
      url: urlDaApi(perfil.capaUrl),
      pessoa: perfil
    });
  };

  const abrirModalRelacao = async tipo => {
    if (!id) return;
    setModalRelacao(tipo);
    setFiltroRelacao('');
    setErroRelacao('');
    setListaRelacao([]);
    setCarregandoRelacao(true);

    try {
      const rotaTentativa = tipo === 'seguidores'
        ? `/Usuarios/${id}/seguidores`
        : `/Usuarios/${id}/seguindo`;

      const resp = await api.get(rotaTentativa);
      const normalizados = normalizarListaUsuarios(resp.data);
      setListaRelacao(normalizados);
    } catch {
      if (tipo === 'seguindo' && proprio) {
        try {
          const [todosPerfisRes, seguidosLogadoRes] = await Promise.all([
            getAventureiros(),
            uid ? getUsuariosSeguidos().catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
          ]);

          const todosPerfis = normalizarListaUsuarios(todosPerfisRes.data).filter(p => p.idUsuario !== id);
          const rawSeguidosLogado = Array.isArray(seguidosLogadoRes.data) ? seguidosLogadoRes.data : [];
          const setSeguidosLogado = new Set(
            rawSeguidosLogado
              .map(item => Number(typeof item === 'object' ? (item?.idUsuario ?? item?.id ?? item?.seguidoId) : item))
              .filter(Boolean)
          );

          setListaRelacao(todosPerfis.filter(p => setSeguidosLogado.has(p.idUsuario)));
        } catch {
          setErroRelacao('Não foi possível carregar a lista de seguindo.');
        }
      } else {
        setListaRelacao([]);
      }
    } finally {
      setCarregandoRelacao(false);
    }
  };

  const alternarSeguirNaLista = async alvoId => {
    if (!uid || !alvoId || seguindoLinhaId === alvoId) return;
    setSeguindoLinhaId(alvoId);
    const jaSegue = idsSeguidos.has(alvoId);

    try {
      if (jaSegue) await deixarDeSeguirUsuario(alvoId);
      else await seguirUsuario(alvoId);

      setIdsSeguidos(prev => {
        const next = new Set(prev);
        if (jaSegue) next.delete(alvoId);
        else next.add(alvoId);
        return next;
      });

      if (proprio && modalRelacao === 'seguindo') {
        setPerfil(p => p ? ({ ...p, seguindoCount: Math.max(0, (p.seguindoCount || 0) + (jaSegue ? -1 : 1)) }) : p);
      }
      if (Number(alvoId) === Number(id)) {
        setPerfil(p => p ? ({ ...p, seguidoresCount: Math.max(0, (p.seguidoresCount || 0) + (jaSegue ? -1 : 1)) }) : p);
      }
    } catch {
      dispararToast('Não foi possível atualizar quem você segue.', 'error');
    } finally {
      setSeguindoLinhaId(null);
    }
  };

  const salvar = async e => {
    e.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setSalvando(true);
    setErroEdicao('');

    const dados = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v != null) dados.append(k, v); });

    try {
      const r = await editarPerfil(dados);
      setPerfil(r.data);
      setPosts(lista => lista.map(p => p.autor?.idUsuario === r.data.idUsuario ? { ...p, autor: { ...p.autor, nomeCompleto: r.data.nomeCompleto, fotoPerfil: r.data.fotoPerfil } } : p));
      localStorage.setItem('NomeUsuario', r.data.nomeCompleto);
      window.dispatchEvent(new CustomEvent('routebooks-profile-updated', { detail: r.data }));
      setEditando(false);

      dispararToast('Alterações salvas com sucesso!', 'success');
    }
    catch (e) {
      const msgErro = e.response?.data?.mensagem || 'Não foi possível salvar as alterações. Verifique sua conexão ou tente novamente.';
      setErroEdicao(msgErro);

      dispararToast(msgErro, 'error');
    }
    finally {
      lock.current = false;
      setSalvando(false);
    }
  };

  const seguir = async () => {
    if (ocupado) return;
    setOcupado(true);
    try {
      if (perfil.seguindo) await deixarDeSeguirUsuario(id);
      else await seguirUsuario(id);
      setPerfil(p => ({ ...p, seguindo: !p.seguindo, seguidoresCount: p.seguidoresCount + (p.seguindo ? -1 : 1) }));
    }
    catch {
      setErroEdicao('Não foi possível atualizar quem você segue.');
      dispararToast('Não foi possível atualizar quem você segue.', 'error');
    }
    finally {
      setOcupado(false);
    }
  };

  const handleExcluirPost = idExcluido => {
    setPosts(lista => lista.filter(item => Number(item.idPost) !== Number(idExcluido)));
    if (proprio && aba === 'posts') {
      setPerfil(p => p ? ({ ...p, postsCount: Math.max(0, (p.postsCount || 0) - 1) }) : p);
    }
    dispararToast('Publicação excluída com sucesso!', 'success');
  };

  const pessoasFiltradas = listaRelacao.filter(p => {
    if (!filtroRelacao.trim()) return true;
    const termo = filtroRelacao.toLowerCase();
    return (
      (p.nomeCompleto || '').toLowerCase().includes(termo) ||
      (p.username || '').toLowerCase().includes(termo) ||
      (p.cidade || '').toLowerCase().includes(termo) ||
      (p.pais || '').toLowerCase().includes(termo)
    );
  });

  return (
    <>
      {/* Componente Toast Global flutuando na raiz da tela */}
      <div className={`toast-routebooks ${toast.show ? 'show' : ''} ${toast.type === 'error' ? 'toast-erro' : ''}`}>
        <div className="toast-icon">
          <i className={`fa ${toast.type === 'error' ? 'fa-exclamation' : 'fa-check'}`}></i>
        </div>
        <div className="toast-content">
          <h5>{toast.type === 'error' ? 'Atenção' : 'Sucesso!'}</h5>
          <p>{toast.message}</p>
        </div>
        <button className="toast-close" onClick={() => setToast({ ...toast, show: false })}>
          <i className="fa fa-times"></i>
        </button>
        <div className="toast-progress"></div>
      </div>

      <FeedLayout>
        {!id ? (
          <div className="feed-state-card"><p>Entre para acessar seu perfil.</p><Link to="/login" className="social-green-button">Entrar</Link></div>
        ) : loading ? (
          <div className="feed-state-card">Carregando perfil...</div>
        ) : erro ? (
          <div className="feed-state-card" role="alert"><p>{erro}</p><button onClick={() => setTentativa(n => n + 1)}>Tentar novamente</button></div>
        ) : perfil && <>
          <header className="profile-page-heading">
            <Link to="/posts" aria-label="Voltar aos posts"><i className="fa fa-arrow-left" aria-hidden="true" /></Link>
            <div>
              <h1>{perfil.nomeCompleto || perfil.username}<VerifiedBadge pessoa={perfil} /></h1>
              <span>{perfil.postsCount} posts</span>
            </div>
          </header>

          <section className="social-profile">
            <div
              className={'profile-cover' + (!perfil.capaUrl ? ' no-cover' : '')}
              onClick={perfil.capaUrl ? abrirVisualizacaoCapa : undefined}
              role={perfil.capaUrl ? 'button' : undefined}
              tabIndex={perfil.capaUrl ? 0 : undefined}
              onKeyDown={e => {
                if (perfil.capaUrl && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  abrirVisualizacaoCapa();
                }
              }}
              style={perfil.capaUrl ? { cursor: 'zoom-in' } : undefined}
              title={perfil.capaUrl ? 'Clique para ampliar a capa' : undefined}
            >
              {perfil.capaUrl ? <img src={urlDaApi(perfil.capaUrl)} alt="Capa do perfil" /> : <i className="fa fa-compass" aria-hidden="true" />}
            </div>

            <div className="profile-identity">
              <div className="profile-avatar">
                <button
                  type="button"
                  className="profile-photo-button"
                  onClick={abrirVisualizacaoAvatar}
                  aria-label="Ver foto do perfil"
                  title="Clique para ver a foto ampliada"
                >
                  <Avatar pessoa={perfil} />
                  <span><i className="fa fa-camera" aria-hidden="true" /></span>
                </button>
              </div>

              {proprio ? (
                <button className="profile-edit-button" onClick={editar}>Editar perfil</button>
              ) : uid ? (
                <button className="profile-edit-button" onClick={seguir} disabled={ocupado}>{perfil.seguindo ? 'Seguindo' : 'Seguir'}</button>
              ) : <Link to="/login" className="profile-edit-button">Seguir</Link>}

              <h2>{perfil.nomeCompleto || perfil.username}<VerifiedBadge pessoa={perfil} /></h2>
              <p className="profile-handle">@{perfil.username}</p>
              <p className="profile-bio">{perfil.biografia || 'Uma nova aventura começa aqui.'}</p>

              <div className="profile-metadata">
                {(perfil.cidade || perfil.pais) && <span><i className="fa fa-map-marker" aria-hidden="true" /> {[perfil.cidade, perfil.uf, perfil.pais].filter(Boolean).join(', ')}</span>}
                <span><i className="fa fa-calendar" aria-hidden="true" /> Membro desde {new Date(perfil.criadoEm).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
              </div>

              <div className="profile-counts">
                <button
                  type="button"
                  onClick={() => abrirModalRelacao('seguindo')}
                  style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer', font: 'inherit' }}
                >
                  <strong>{perfil.seguindoCount}</strong> Seguindo
                </button>
                <button
                  type="button"
                  onClick={() => abrirModalRelacao('seguidores')}
                  style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer', font: 'inherit' }}
                >
                  <strong>{perfil.seguidoresCount}</strong> Seguidores
                </button>
              </div>
            </div>

            <div className="profile-tabs" role="group" aria-label="Publicações do perfil">
              {[['posts', 'Posts'], ['midias', 'Mídias'], ['roteiros', 'Roteiros'], ['curtidas', 'Curtidas'], ['estatisticas', 'Estatísticas']].map(([key, label]) => (
                <button
                  key={key}
                  className={aba === key ? 'active' : ''}
                  aria-pressed={aba === key}
                  onClick={() => selecionarAba(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {editando && (
            <section className="profile-editor">
              <h2>Editar perfil</h2>
              <form onSubmit={salvar}>
                <fieldset disabled={salvando}>
                  {[['nomeCompleto', 'Nome', 100], ['biografia', 'Biografia', 500], ['cidade', 'Cidade', 100], ['uf', 'Estado (UF)', 2], ['pais', 'País', 100]].map(([key, label, max]) => (
                    <label key={key}>
                      {label}
                      {key === 'biografia' ? (
                        <textarea value={form[key]} maxLength={max} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                      ) : (
                        <input required={key === 'nomeCompleto'} value={form[key]} maxLength={max} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                      )}
                    </label>
                  ))}

                  <ProfilePhotoInput label="Foto do perfil" file={form.foto} current={urlDaApi(perfil.fotoPerfil)} onChange={foto => setForm(f => ({ ...f, foto }))} />
                  <ProfilePhotoInput label="Capa do perfil" file={form.capa} current={urlDaApi(perfil.capaUrl)} onChange={capa => setForm(f => ({ ...f, capa }))} />

                  <small>JPG, PNG ou WEBP; até 5 MB por imagem.</small>

                  <div className="profile-editor-actions">
                    <button type="button" onClick={() => setEditando(false)}>Cancelar</button>
                    <button className="social-green-button" type="submit">{salvando ? 'Salvando...' : 'Salvar alterações'}</button>
                  </div>
                </fieldset>
              </form>
            </section>
          )}

          {erroEdicao && <p role="alert" className="feed-toast">{erroEdicao}</p>}

          {aba === 'estatisticas' ? (
            <GraficoDestinos usuarioId={id} />
          ) : (
            <>
              {aba === 'roteiros' && <p className="feed-side-empty">Relatos com local adicionado.</p>}

              {loadingPosts ? (
                <div className="feed-state-card">Carregando relatos...</div>
              ) : erroPosts ? (
                <div className="feed-state-card" role="alert">{erroPosts}<button onClick={() => setTentativa(n => n + 1)}>Tentar novamente</button></div>
              ) : posts.length ? (
                <div className="feed-post-list">
                  {posts.map(p => (
                    <PostCard
                      key={p.idPost}
                      post={p}
                      onChange={novo => setPosts(lista => lista.map(item => item.idPost === novo.idPost ? novo : item).filter(item => aba !== 'curtidas' || !proprio || item.idPost !== novo.idPost || novo.meuVoto === 1))}
                      onDelete={handleExcluirPost}
                    />
                  ))}
                </div>
              ) : (
                <div className="feed-state-card">Nenhuma publicação nesta aba ainda.</div>
              )}
            </>
          )}
        </>}
      </FeedLayout>

      {modalMidia && (
        <div
          onClick={() => setModalMidia(null)}
          role="dialog"
          aria-modal="true"
          aria-label={modalMidia.titulo}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#11261f',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '16px',
              maxWidth: modalMidia.tipo === 'capa' ? '900px' : '420px',
              width: '100%',
              padding: '18px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem' }}>{modalMidia.titulo}</h3>
              <button
                type="button"
                onClick={() => setModalMidia(null)}
                aria-label="Fechar visualização"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#f8fafc',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {modalMidia.url ? (
                <img
                  src={modalMidia.url}
                  alt={modalMidia.titulo}
                  style={
                    modalMidia.tipo === 'capa'
                      ? {
                          display: 'block',
                          width: '100%',
                          aspectRatio: '3 / 1',
                          maxHeight: '320px',
                          borderRadius: '12px',
                          objectFit: 'cover'
                        }
                      : {
                          display: 'block',
                          width: '210px',
                          height: '210px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid rgba(16, 185, 129, 0.45)'
                        }
                  }
                />
              ) : (
                <div
                  style={{
                    width: '210px',
                    height: '210px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '56px',
                    fontWeight: 700,
                    color: '#fff',
                    background: 'linear-gradient(140deg, #5c9974, #234b40)',
                    border: '3px solid rgba(16, 185, 129, 0.45)'
                  }}
                >
                  {iniciais(modalMidia.pessoa?.nomeCompleto || modalMidia.pessoa?.username || 'Aventureiro')}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setModalMidia(null)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #527b5d',
                  background: 'transparent',
                  color: '#edf4eb',
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              {proprio && (
                <button
                  type="button"
                  onClick={() => {
                    setModalMidia(null);
                    editar();
                  }}
                  className="social-green-button"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 0,
                    fontSize: '13.5px',
                    cursor: 'pointer'
                  }}
                >
                  {modalMidia.tipo === 'capa' ? 'Editar capa' : 'Editar foto'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}