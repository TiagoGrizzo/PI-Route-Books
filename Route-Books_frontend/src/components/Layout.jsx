import { useEffect, useState } from 'react';
import { Link, Outlet, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '../assets/css/reset.css';
import '../assets/css/color.css';
import '../assets/css/style.css';
import logoNavbar from '../assets/imgs/rb-logo2.png';
import { getNaoLidas } from '../api/Route-book.jsx';

export default function Layout() {
    const [menuAberto, setMenuAberto] = useState(false);
    const [menuNavegacaoAberto, setMenuNavegacaoAberto] = useState(false);
    const [temaEscuro, setTemaEscuro] = useState(false);
    const [usuarioNome, setUsuarioNome] = useState(null);

    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const usuarioLogado = Boolean(localStorage.getItem('UsuarioId'));

    useEffect(() => {
        const temaSalvo = localStorage.getItem('theme');
        const isDark = temaSalvo === 'dark';
        setTemaEscuro(isDark);
        if (isDark) {
            document.body.classList.add('dark-mode');
        }

        setUsuarioNome(localStorage.getItem('NomeUsuario'));
    }, []);

    // Atualiza o badge de mensagens não lidas da navbar
    useEffect(() => {
        const meuId = Number(localStorage.getItem('UsuarioId'));
        if (meuId) {
            getNaoLidas(meuId)
                .then((res) => {
                    const badge = document.getElementById('notificacaoNavbarGlobal');
                    if (badge) {
                        badge.style.display = res.data?.qtd > 0 ? 'inline-block' : 'none';
                    }
                })
                .catch(() => { });
        }
    }, [location.pathname]);

    const toggleDarkMode = () => {
        const novoEstado = !temaEscuro;
        setTemaEscuro(novoEstado);
        document.body.classList.toggle('dark-mode', novoEstado);
        localStorage.setItem('theme', novoEstado ? 'dark' : 'light');
    };

    const handlePesquisa = (e) => {
        e.preventDefault();
        const termo = e.currentTarget.elements[0].value.trim();
        if (termo) {
            navigate(`/posts?busca=${encodeURIComponent(termo)}`);
        }
    };

    const sairConta = () => {
        localStorage.removeItem('UsuarioId');
        localStorage.removeItem('NomeUsuario');
        setMenuAberto(false);
        navigate('/login');
    };

    return (
        <>
            <header className="header-navbar">
                <nav className="navbar navbar-expand-lg bg-navbar container-xxl px-3">
                    <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap">

                        {/* Logo */}
                        <Link to="/" className="navbar-brand d-flex align-items-center" onClick={() => setMenuNavegacaoAberto(false)}>
                            <img src={logoNavbar} className="logo-tamanho" alt="Logo Route Books" />
                        </Link>

                        {/* Nav links + busca (desktop) */}
                        <div className="d-none d-lg-flex align-items-center gap-4 navbar-center">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center gap-2">
                                <li className="nav-item">
                                    <NavLink
                                        to="/"
                                        end
                                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} text-color-navbar`}
                                    >
                                        Home
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink
                                        to="/aventurerios"
                                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} text-color-navbar position-relative`}
                                    >
                                        Aventureiros
                                        <span id="notificacaoNavbarGlobal" className="notificacao-navbar" style={{ display: 'none' }}></span>
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink
                                        to="/quem-somos"
                                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} text-color-navbar`}
                                    >
                                        Sobre
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink
                                        to="/contato"
                                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} text-color-navbar`}
                                    >
                                        Contato
                                    </NavLink>
                                </li>
                            </ul>

                            <form className="d-flex barra-pesquisa navbar-search" onSubmit={handlePesquisa}>
                                <input
                                    className="form-control search-bar"
                                    type="search"
                                    placeholder="Pesquisar"
                                    aria-label="Search"
                                    value={searchParams.get('busca') || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.trim() === '') {
                                            navigate('/posts');
                                        } else {
                                            navigate(`/posts?busca=${encodeURIComponent(value.trim())}`);
                                        }
                                    }}
                                />
                                <button className="btn btn-outline-success" type="submit">
                                    <i className="fa fa-search" aria-hidden="true"></i>
                                </button>
                            </form>
                        </div>

                        {/* User actions + dark mode (desktop) */}
                        <div className="d-none d-lg-flex align-items-center gap-2 navbar-actions ms-auto">
                            <div className="dropdown perfil-geral">
                                <button
                                    className="btn btn-perfil dropdown-toggle"
                                    type="button"
                                    aria-expanded={menuAberto}
                                    onClick={() => setMenuAberto(!menuAberto)}
                                >
                                    <i className="fa fa-user me-1" aria-hidden="true"></i>
                                    {" "}{usuarioLogado && usuarioNome ? ` ${usuarioNome}` : ' Entrar'}
                                </button>

                                {menuAberto && (
                                    <ul className="dropdown-menu menu-perfil" style={{ position: 'absolute', right: 0, top: '110%' }}>
                                        {usuarioLogado ? (
                                            <>
                                                <li><Link to="/perfil" className="dropdown-item perfil-item" onClick={() => setMenuAberto(false)}>Perfil</Link></li>
                                                <li><Link to="/posts/criar" className="dropdown-item perfil-item" onClick={() => setMenuAberto(false)}>Criar Postagem</Link></li>
                                                <li><Link to="/chat" className="dropdown-item perfil-item" onClick={() => setMenuAberto(false)}>Chat</Link></li>
                                                <li><Link to="/login" className="dropdown-item perfil-item" onClick={sairConta}>Sair da conta</Link></li>
                                            </>
                                        ) : (
                                            <>
                                                <li><Link to="/login" className="dropdown-item perfil-item" onClick={() => setMenuAberto(false)}>Fazer Login</Link></li>
                                                <li><Link to="/cadastro" className="dropdown-item perfil-item" onClick={() => setMenuAberto(false)}>Cadastre-se</Link></li>
                                            </>
                                        )}
                                    </ul>
                                )}
                            </div>

                            <div className="dark-mode-toggle">
                                <button className="btn btn-dark-mode" type="button" onClick={toggleDarkMode} aria-label="Alternar tema">
                                    <i className={`fa ${temaEscuro ? 'fa-sun-o light-icon' : 'fa-moon-o dark-icon'}`} aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>

                        {/* Mobile toggler */}
                        <button
                            className="navbar-toggler bg-color-menu-btn d-lg-none"
                            type="button"
                            aria-label="Toggle navigation"
                            onClick={() => setMenuNavegacaoAberto(!menuNavegacaoAberto)}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                    </div>

                    {/* Mobile collapse */}
                    <div className={`collapse navbar-collapse ${menuNavegacaoAberto ? 'show' : ''}`} id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100 align-items-center gap-2">
                            <li className="nav-item">
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} text-color-navbar`}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/aventurerios"
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} text-color-navbar position-relative`}
                                >
                                    Aventureiros
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/quem-somos"
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} text-color-navbar`}
                                >
                                    Sobre
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/contato"
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} text-color-navbar`}
                                >
                                    Contato
                                </NavLink>
                            </li>
                        </ul>

                        <form className="d-flex barra-pesquisa w-100 mt-3" onSubmit={handlePesquisa}>
                            <input
                                className="form-control search-bar flex-grow-1"
                                type="search"
                                placeholder="Pesquisar"
                                aria-label="Search"
                                value={searchParams.get('busca') || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.trim() === '') {
                                        navigate('/posts');
                                    } else {
                                        navigate(`/posts?busca=${encodeURIComponent(value.trim())}`);
                                    }
                                }}
                            />
                            <button className="btn btn-outline-success" type="submit">
                                <i className="fa fa-search" aria-hidden="true"></i>
                            </button>
                        </form>

                        <div className="d-flex align-items-center gap-2 w-100 mt-3 justify-content-center">
                            <div className="dropdown perfil-geral w-100">
                                <button
                                    className="btn btn-perfil dropdown-toggle w-100"
                                    type="button"
                                    aria-expanded={menuAberto}
                                    onClick={() => setMenuAberto(!menuAberto)}
                                >
                                    <i className="fa fa-user me-1" aria-hidden="true"></i>
                                    {" "}{usuarioLogado && usuarioNome ? ` ${usuarioNome}` : ' Entrar'}
                                </button>
                                {menuAberto && (
                                    <ul className="dropdown-menu menu-perfil w-100" style={{ position: 'static', right: 'auto', top: 'auto' }}>
                                        {usuarioLogado ? (
                                            <>
                                                <li><Link to="/perfil" className="dropdown-item perfil-item" onClick={() => setMenuAberto(false)}>Perfil</Link></li>
                                                <li><Link to="/posts/criar" className="dropdown-item perfil-item" onClick={() => setMenuAberto(false)}>Criar Postagem</Link></li>
                                                <li><Link to="/chat" className="dropdown-item perfil-item" onClick={() => setMenuAberto(false)}>Chat</Link></li>
                                                <li><Link to="/login" className="dropdown-item perfil-item" onClick={sairConta}>Sair da conta</Link></li>
                                            </>
                                        ) : (
                                            <>
                                                <li><Link to="/login" className="dropdown-item perfil-item" onClick={() => setMenuAberto(false)}>Fazer Login</Link></li>
                                                <li><Link to="/cadastro" className="dropdown-item perfil-item" onClick={() => setMenuAberto(false)}>Cadastre-se</Link></li>
                                            </>
                                        )}
                                    </ul>
                                )}
                            </div>
                            <div className="dark-mode-toggle ms-2">
                                <button className="btn btn-dark-mode" type="button" onClick={toggleDarkMode} aria-label="Alternar tema">
                                    <i className={`fa ${temaEscuro ? 'fa-sun-o light-icon' : 'fa-moon-o dark-icon'}`} aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main role="main" className="flex-grow-1">
                <Outlet />
            </main>

            <footer className="footer-index">
                <div className="itens-footer-geral">
                    <div className="item-footer item-footer-direitos">
                        <h4 className="titulo-font">
                            Route Books © Todos os direitos reservados
                        </h4>
                    </div>

                    <div className="item-footer">
                        <h4 className="titulo-font">
                            Desenvolvido por:
                            <br />
                            <a href="https://github.com/LucasEduardoPereiraCruz" target="_blank" rel="noreferrer">
                                Lucas Cruz
                            </a>
                            <br />
                            <a href="https://github.com/TiagoGrizzo" target="_blank" rel="noreferrer">
                                Tiago Grizzo
                            </a>
                        </h4>
                    </div>

                    <div className="logo-footer">
                        <img src={logoNavbar} className="logo-footer" alt="Logo Route Books" />
                    </div>
                </div>
            </footer>
        </>
    );
}
