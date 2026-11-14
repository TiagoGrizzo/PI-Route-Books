import VerifiedBadge from './VerifiedBadge.jsx';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { logout, getComunidades, getPerfilPublico, getAventureiros, getUsuariosSeguidos, seguirUsuario, deixarDeSeguirUsuario, getNaoLidas } from '../api/Route-book.jsx';
import { iniciais, urlDaApi } from './postUtils.js';
import SeasonalDestinations from './SeasonalDestinations.jsx';
import CommunityImage from './CommunityImage.jsx';
import logoOficial from '../assets/imgs/rb-logo2.png';
import '../assets/css/feed.css';

export default function FeedLayout({ children, aba = '', onSelect, onCreate, showRight = true }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const busca = params.get('busca') || '';
  const usuarioId = Number(localStorage.getItem('UsuarioId')) || null;
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [pessoas, setPessoas] = useState([]);
  const [carregandoPessoas, setCarregandoPessoas] = useState(true);
  const [erroPessoas, setErroPessoas] = useState(false);
  const [tentativaPessoas, setTentativaPessoas] = useState(0);
  const [idsSeguidos, setIdsSeguidos] = useState(new Set());
  const [seguindoIdsCarregando, setSeguindoIdsCarregando] = useState(new Set());
  const [menuMaisAberto, setMenuMaisAberto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [sessaoExpirada, setSessaoExpirada] = useState(false);
  const [comunidades, setComunidades] = useState([]);
  const [erroComunidades, setErroComunidades] = useState(false);
  const [saindo, setSaindo] = useState(false);

  // Estados das notificações (Sino e Balão de Mensagens)
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0);
  const [novosSeguidores, setNovosSeguidores] = useState(0);

  const sair = async () => {
    if (saindo) return; setSaindo(true);
    try { await logout(); localStorage.removeItem('UsuarioId'); localStorage.removeItem('NomeUsuario'); navigate('/login'); }
    catch { setMensagem('Não foi possível sair. Tente novamente.'); }
    finally { setSaindo(false); }
  };
  const carregarComunidades = () => getComunidades().then(r => { setComunidades(r.data); setErroComunidades(false); }).catch(() => setErroComunidades(true));
  useEffect(() => { carregarComunidades(); }, []);
  useEffect(() => {
    const expirar = () => setSessaoExpirada(true);
    const atualizar = e => setPerfilUsuario(e.detail);
    window.addEventListener('routebooks-session-expired', expirar);
    window.addEventListener('routebooks-profile-updated', atualizar);
    return () => { window.removeEventListener('routebooks-session-expired', expirar); window.removeEventListener('routebooks-profile-updated', atualizar); };
  }, []);
  const nomeUsuario = usuarioId ? (perfilUsuario?.nomeCompleto || localStorage.getItem('NomeUsuario') || 'Aventureiro') : 'Entrar';
  const localUsuario = [perfilUsuario?.cidade, perfilUsuario?.pais].filter(Boolean).join(', ') || 'Local não informado';
  const fotoUsuario = urlDaApi(perfilUsuario?.fotoPerfil);
  const avatarUsuario = fotoUsuario ? <img className="feed-avatar feed-avatar-photo feed-avatar-account" src={fotoUsuario} alt="" /> : <span className="feed-avatar feed-avatar-account">{iniciais(nomeUsuario)}</span>;
  const caminhoCriarPost = usuarioId ? '/posts/criar' : '/login';
  const abrirPublicacao = () => onCreate ? onCreate() : navigate('/posts?criar=1');
  const setAba = value => onSelect ? onSelect(value) : navigate('/posts?aba=' + value);
  useEffect(() => {
    document.body.classList.add('route-feed-active');
    return () => document.body.classList.remove('route-feed-active');
  }, []);

  // Carrega perfil, seguidores e checa notificações periodicamente
  useEffect(() => {
    let ativo = true;
    if (!usuarioId) return;

    const checarNotificacoes = () => {
      // 1. Verifica mensagens não lidas no Chat
      getNaoLidas(usuarioId)
        .then(r => {
          if (!ativo) return;
          // Trata qualquer formato que o C# possa retornar (número, total, quantidade ou naoLidas)
          const dados = r.data;
          const total = typeof dados === 'number'
            ? dados
            : (dados?.total ?? dados?.quantidade ?? dados?.naoLidas ?? dados?.count ?? 0);

          setMensagensNaoLidas(Number(total) || 0);
        })
        .catch(err => {
          console.error("Erro ao buscar mensagens não lidas:", err);
        });

      // 2. Verifica se ganhou novos seguidores comparando com o último valor visto
      getPerfilPublico(usuarioId)
        .then(r => {
          if (!ativo) return;
          setPerfilUsuario(r.data);
          const atual = r.data?.seguidoresCount ?? 0;
          const chaveStorage = `rb_seguidores_vistos_${usuarioId}`;
          const vistoSalvo = localStorage.getItem(chaveStorage);

          if (vistoSalvo === null) {
            localStorage.setItem(chaveStorage, String(atual));
          } else {
            const diferenca = atual - Number(vistoSalvo);
            if (diferenca > 0) setNovosSeguidores(diferenca);
          }
        })
        .catch(() => { });
    };

    checarNotificacoes();
    getUsuariosSeguidos().then(r => { if (ativo) setIdsSeguidos(new Set(r.data.map(Number))); }).catch(() => { });

    const intervalo = setInterval(checarNotificacoes, 15000); // Atualiza a cada 15s
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [usuarioId]);

  // Limpa a notificação do sino ao clicar nele
  const limparNotificacaoSeguidores = () => {
    if (usuarioId && perfilUsuario?.seguidoresCount != null) {
      localStorage.setItem(`rb_seguidores_vistos_${usuarioId}`, String(perfilUsuario.seguidoresCount));
    }
    setNovosSeguidores(0);
  };

  useEffect(() => {
    if (!showRight) return;
    let ativo = true;

    getAventureiros().then(r => { if (ativo) setPessoas(r.data); })
      .catch(() => { if (ativo) setErroPessoas(true); })
      .finally(() => { if (ativo) setCarregandoPessoas(false); });
    return () => { ativo = false; };
  }, [showRight, tentativaPessoas]);
  const aventureiros = pessoas.filter(p => Number(p.idUsuario) !== usuarioId).slice(0, 3);
  const alternarSeguir = async pessoa => {
    if (seguindoIdsCarregando.has(pessoa.idUsuario)) return;
    setSeguindoIdsCarregando(s => new Set(s).add(pessoa.idUsuario));
    try {
      if (idsSeguidos.has(pessoa.idUsuario)) await deixarDeSeguirUsuario(pessoa.idUsuario); else await seguirUsuario(pessoa.idUsuario);
      setIdsSeguidos(s => { const next = new Set(s); if (next.has(pessoa.idUsuario)) next.delete(pessoa.idUsuario); else next.add(pessoa.idUsuario); return next; });
    } catch { setMensagem('Não foi possível seguir esse aventureiro. Entre na sua conta e tente novamente.'); }
    finally { setSeguindoIdsCarregando(s => { const next = new Set(s); next.delete(pessoa.idUsuario); return next; }); }
  };
  return <div className={"route-feed" + (!showRight ? " feed-without-right" : "")}>
    <header className="feed-topbar">
      <Link to="/" className="feed-brand" aria-label="Route Books, início">
        <img src={logoOficial} alt="Route Books" />
      </Link>

      <form className="feed-search" onSubmit={event => { event.preventDefault(); const input = event.currentTarget.elements.busca; const termo = input.value.trim(); if (!termo) { input.setCustomValidity("Procure o destino que você quer encontrar"); input.reportValidity(); return; } input.setCustomValidity(""); navigate("/posts?busca=" + encodeURIComponent(termo)); }}>
        <i className="fa fa-search" aria-hidden="true"></i>
        <input required onInput={event => event.target.setCustomValidity("")} name="busca" type="search" placeholder="Buscar destinos, rotas ou posts no Route Books..." defaultValue={busca} aria-label="Buscar destinos, rotas ou posts" />
      </form>

      <div className="feed-top-actions">
        {/* Ícone do Sino com notificação de novos seguidores */}
        <Link to="/aventureiros" onClick={limparNotificacaoSeguidores} className="feed-icon-link" aria-label="Aventureiros">
          <i className="fa fa-bell-o" aria-hidden="true"></i>
          {novosSeguidores > 0 && <span className="feed-notif-badge">{novosSeguidores > 9 ? '9+' : novosSeguidores}</span>}
        </Link>

        {/* Ícone do Balão com notificação de mensagens não lidas */}
        <Link to="/chat" onClick={() => setMensagensNaoLidas(0)} className="feed-icon-link" aria-label="Conversas">
          <i className="fa fa-commenting-o" aria-hidden="true"></i>
          {mensagensNaoLidas > 0 && <span className="feed-notif-badge">{mensagensNaoLidas > 9 ? '9+' : mensagensNaoLidas}</span>}
        </Link>

        <button type="button" onClick={abrirPublicacao} className="feed-create-link">Registrar Viagem <span aria-hidden="true">🗺️</span></button>
        <Link to={usuarioId ? '/perfil' : '/login'} className="feed-account">
          <span className="feed-account-avatar">{avatarUsuario}{usuarioId && <span className="feed-online-dot" role="img" aria-label="Conectado" />}</span>
          <span className="feed-account-copy"><strong>{nomeUsuario}<VerifiedBadge pessoa={perfilUsuario} /></strong><small>{usuarioId ? <><i className="fa fa-map-marker" aria-hidden="true" /> {localUsuario}</> : 'Entre na comunidade'}</small></span>
        </Link>
      </div>
    </header>

    <div className="feed-shell">
      <aside className="feed-sidebar" aria-label="Navegação principal">
        <nav className="feed-nav">
          <NavLink to="/" end className="feed-nav-link"><i className="fa fa-home" aria-hidden="true"></i><span>Início</span></NavLink>
          <NavLink to="/posts" className={({ isActive }) => "feed-nav-link" + (isActive && (!aba || aba === "para-voce") ? " active" : "")}><i className="fa fa-compass" aria-hidden="true"></i><span>Explorar Rotas</span></NavLink>
          <NavLink to={caminhoCriarPost} className="feed-nav-link"><i className="fa fa-book" aria-hidden="true"></i><span>Diário de Bordo</span></NavLink>
          <button type="button" className={`feed-nav-link ${aba === 'meus' ? 'active' : ''}`} onClick={() => setAba('meus')}><i className="fa fa-map-o" aria-hidden="true"></i><span>Meus Roteiros</span></button>
          <button type="button" className={`feed-nav-link ${aba === 'salvos' ? 'active' : ''}`} onClick={() => setAba('salvos')}><i className="fa fa-bookmark-o" aria-hidden="true"></i><span>Salvos</span></button>
          <div className="feed-profile-more-row">
            <NavLink to={usuarioId ? '/perfil' : '/login'} className="feed-nav-link"><i className="fa fa-user-o" aria-hidden="true"></i><span>Perfil</span></NavLink>
            <button type="button" className="feed-more-button" aria-expanded={menuMaisAberto} onClick={() => setMenuMaisAberto((aberto) => !aberto)}>Mais</button>
          </div>
          {menuMaisAberto && <div className="feed-more-menu"><NavLink to="/aventureiros">Aventureiros</NavLink><NavLink to="/chat">Conversas</NavLink><NavLink to="/quem-somos">Sobre</NavLink><NavLink to="/contato">Contato</NavLink>{usuarioId && <button type="button" disabled={saindo} onClick={sair}>{saindo ? 'Saindo...' : 'Sair da conta'}</button>}</div>}
        </nav>

        <div className="feed-sidebar-divider"></div>
        <div className="feed-sidebar-section">
          <h2>COMUNIDADES</h2>
          <p>Participe, compartilhe e conecte-se</p>
          {comunidades.map(c => <NavLink key={c.id} to={'/comunidades/' + c.slug} className="feed-community-link"><CommunityImage comunidade={c} /><span>{c.nome}<VerifiedBadge comunidade={c} /></span></NavLink>)}
          {erroComunidades && <button className="feed-more-button" onClick={carregarComunidades}>Recarregar comunidades</button>}
          <button type="button" onClick={abrirPublicacao} className="feed-community-link feed-create-community"><span className="feed-create-plus">+</span><span>Criar publicação</span></button>
        </div>
      </aside>

      <main className="feed-main-column">{sessaoExpirada && <p className="feed-toast" role="alert">Sua sessão expirou. <Link to={'/login?voltar=' + encodeURIComponent(window.location.pathname + window.location.search)}>Entrar novamente</Link> para curtir, publicar ou alterar seu perfil.</p>}{mensagem && <p role="alert" className="feed-toast">{mensagem}</p>}{children}</main>
      {showRight && <aside className="feed-right-column" aria-label="Descubra mais">
        <SeasonalDestinations />

        <section className="feed-side-card">
          <div className="feed-side-card-heading"><h2>Aventureiros para seguir <span>(Quem seguir)</span></h2><Link to="/aventureiros">Ver todos</Link></div>
          {carregandoPessoas ? <p className="feed-side-empty" role="status">Carregando aventureiros...</p> : erroPessoas ? <p className="feed-side-empty" role="alert">Não foi possível carregar os perfis. <button type="button" className="feed-more-button" onClick={() => { setCarregandoPessoas(true); setErroPessoas(false); setTentativaPessoas(n => n + 1); }}>Tentar novamente</button></p> : aventureiros.length ? aventureiros.map((pessoa) => <div className="feed-person" key={pessoa.idUsuario}>{pessoa.fotoPerfil ? <img className="feed-avatar feed-avatar-small feed-avatar-photo" src={urlDaApi(pessoa.fotoPerfil)} alt="" /> : <span className="feed-avatar feed-avatar-small">{iniciais(pessoa.nomeCompleto || pessoa.username)}</span>}<div className="feed-person-copy"><strong><Link to={'/perfil/' + pessoa.idUsuario}>{pessoa.nomeCompleto || pessoa.username}<VerifiedBadge pessoa={pessoa} /></Link></strong><small>{[pessoa.cidade, pessoa.uf].filter(Boolean).join(' · ') || 'Aventureiro Route Books'}</small></div>{usuarioId ? <button type="button" onClick={() => alternarSeguir(pessoa)} disabled={seguindoIdsCarregando.has(pessoa.idUsuario)} className={`feed-follow-button ${idsSeguidos.has(pessoa.idUsuario) ? 'following' : ''}`} aria-label={`${idsSeguidos.has(pessoa.idUsuario) ? 'Deixar de seguir' : 'Seguir'} ${pessoa.nomeCompleto || pessoa.username}`}>{seguindoIdsCarregando.has(pessoa.idUsuario) ? '...' : idsSeguidos.has(pessoa.idUsuario) ? 'Seguindo' : 'Seguir'}</button> : <Link to="/login" className="feed-follow-button">Seguir</Link>}</div>) : <p className="feed-side-empty">Nenhum aventureiro disponível para seguir no momento.</p>}
        </section>

        <section className="feed-challenge-card">
          <div className="feed-side-card-heading"><h2>DESAFIOS DO VIAJANTE</h2></div>
          <label className="feed-challenge-task"><input type="checkbox" disabled /><span>Complete 3 trilhas este mês 🧭<small>(Progresso: 2/3)</small></span></label>
          <div className="feed-progress"><span></span></div>
          <div className="feed-challenge-divider"></div>
          <Link to="/quem-somos" className="feed-policy-link">Política da plataforma nos mochileiros <i className="fa fa-arrow-right" aria-hidden="true"></i></Link>
        </section>

        <p className="feed-footer-links"><Link to="/quem-somos">Sobre</Link><Link to="/contato">Contato</Link><span>Route Books © {new Date().getFullYear()}</span></p>
      </aside>}
    </div>
  </div>;
}