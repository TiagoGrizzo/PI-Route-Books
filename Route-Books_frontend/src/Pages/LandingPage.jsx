import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Se estiver a usar React Router
import '../assets/css/index.css'; // Ajuste o caminho do CSS conforme a estrutura do seu projeto React
import { getUltimosPosts } from '../api/Route-book.jsx';
// Importação das imagens (ajuste os caminhos conforme sua pasta public ou src/assets)
import imgMundo from '../assets/imgs/mundo.png';
import imgPeru from '../assets/imgs/peru.jpg';
import imgAlgarve from '../assets/imgs/algarve.jpg';
import imgLencois from '../assets/imgs/lencois_maranhenses.jpg';
import imgBrotas from '../assets/imgs/nascente_areia_que_canta-brotas.jpg';
import imgAguasPedro from '../assets/imgs/Aguas-saoPedro.png';
import imgHolambra from '../assets/imgs/Moinho-Povos-Unidos.jpg';

export default function LandingPage() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [toastMensagem, setToastMensagem] = useState(null);

  // ID do usuário logado no momento (pode vir do localStorage ou contexto de autenticação)
  const usuarioLogadoId = Number(localStorage.getItem('UsuarioId')) || null;

  // Busca os últimos posts da API quando o componente carregar
  useEffect(() => {
      getUltimosPosts()
      .then(response => {
        setPosts(response.data);
        setLoadingPosts(false);
      })
      .catch(err => {
        console.error("Erro ao buscar posts:", err);
        setLoadingPosts(false);
      });
  }, []);

  return (
    <>
      {/* TOAST */}
      {toastMensagem && (
        <div id="toastSucesso" className="toast-routebooks">
          <div className="toast-icon">
            <i className="fa fa-check"></i>
          </div>
          <div className="toast-content">
            <h5>Route Books</h5>
            <p>{toastMensagem}</p>
          </div>
          <button type="button" className="toast-close" onClick={() => setToastMensagem(null)}>
            <i className="fa fa-times"></i>
          </button>
          <div className="toast-progress"></div>
        </div>
      )}

      <div className="bg-criar-post">
        <div className="div-criar-post-geral container-xxl">
          <div className="div-criar-post titulo-font">
            <Link to="/posts/criar" className="btn-criar-post text-decoration-none">
              <i className="fa fa-plus"></i> Criar Post
            </Link>
          </div>
        </div>
      </div>

      <div className="inicio-index container-xxl">
        <img src={imgMundo} alt="Mochilão aventura" />
        <h2 className="titulo-font cor-titulo">Explore o mundo com liberdade e emoção!</h2>
        <p>
          Descubra destinos incríveis, dicas essenciais e histórias inspiradoras para quem ama viajar de mochila nas
          costas. Aventuras, trilhas, paisagens de tirar o fôlego e experiências inesquecíveis esperam por você.
          Pronto para embarcar nessa jornada?
        </p>
        <Link to="/posts" className="btn-inicio text-decoration-none">Comece sua aventura</Link>

        <br /><br /><br />
        <div className="bg-conteudo">
          <div className="title-conteudo">
            <h3 className="h3-conteudo titulo-font cor-titulo">Últimos posts feitos por aventureiros</h3>
          </div>

          <div className="div-fundo-relatos">
            <div className="fundo-relatos">
              {loadingPosts ? (
                <p style={{ textAlign: 'center', color: '#fff' }}>Carregando postagens...</p>
              ) : posts.length > 0 ? (
                posts.map((p) => {
                  const resumoConteudo = p.conteudo?.length > 150 
                    ? p.conteudo.substring(0, 150) + '...' 
                    : p.conteudo;

                  const nomeAutor = p.autor?.nomeCompleto || p.autor?.username || 'Aventureiro';
                  const dataFormatada = new Date(p.dataCriacao).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });

                  return (
                    <div className="relatos" key={p.idPost || p.id}>
                      <div className="conteudo-card-index">
                        <h3 className="titulo-font cor-titulo">{p.titulo}</h3>
                        <p>{resumoConteudo}</p>

                        <div className="post-info-index d-flex align-items-center flex-wrap">
                          <span>
                            Por {nomeAutor} • {dataFormatada}
                          </span>

                          {p.usuariosIdUsuario !== usuarioLogadoId && (
                            <Link
                              to={`/chat?idDoAmigo=${p.usuariosIdUsuario}`}
                              className="btn btn-sm btn-outline-success ms-3 py-0 px-2"
                              style={{ borderRadius: '12px', fontSize: '11px' }}
                            >
                              <i className="fa fa-comments"></i> Chamar no Chat
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="div-btn-relatos">
                        <Link to={`/posts/detalhes/${p.idPost || p.id}`}>
                          <button className="btn-relatos">Ver Post</button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: 'center', color: '#fff' }}>
                  Ainda não há postagens. Seja o primeiro a compartilhar sua aventura!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <br />

      <h1 className="container-xxl conheca-index titulo-font cor-titulo">Alguns lugares que você deve visitar!</h1>
      <section id="projetos" className="projetos">
        <div className="projetos-caixa container-xxl">
          <div className="projetos-card">
            <img src={imgPeru} alt="Peru" className="projetos-imagem" />
            <div className="caixa-textos-projeto">
              <h5 className="info-projetos">Ilhas flutuantes do Lago Titicaca - Puno - Peru</h5> <br />
              <p className="paragrafo-projetos">São plataformas artificiais milenares construídas inteiramente de totora, uma planta aquática, habitadas pelo povo Uros.</p>
            </div>
          </div>

          <div className="projetos-card">
            <img src={imgAlgarve} alt="Portugal" className="projetos-imagem" />
            <div className="caixa-textos-projeto">
              <h5 className="info-projetos">Algarve - Faro - Portugal</h5> <br />
              <p className="paragrafo-projetos">Situado no extremo sul de Portugal, é uma região costeira famosa pelas suas falésias douradas e águas cristalinas.</p>
            </div>
          </div>

          <div className="projetos-card">
            <img src={imgLencois} alt="Lençois Maranhenses" className="projetos-imagem" />
            <div className="caixa-textos-projeto">
              <h5 className="info-projetos">Lençóis Maranhenses - Barreirinhas - (MA)</h5> <br />
              <p className="paragrafo-projetos">Famosa por suas grandes dunas de areia branca e lagoas temporárias formadas pela água da chuva.</p>
            </div>
          </div>

          <div className="projetos-card">
            <img src={imgBrotas} alt="Brotas" className="projetos-imagem" />
            <div className="caixa-textos-projeto">
              <h5 className="info-projetos">Nascente Areia que Canta - Brotas - (SP)</h5> <br />
              <p className="paragrafo-projetos">Oferece uma visita à nascente de águas cristalinas vindas do Aquífero Guarani, com uma areia que "canta".</p>
            </div>
          </div>

          <div className="projetos-card">
            <img src={imgAguasPedro} alt="Águas de São Pedro" className="projetos-imagem" />
            <div className="caixa-textos-projeto">
              <h5 className="info-projetos">Resorts, Parques - Águas de São Pedro - (SP)</h5> <br />
              <p className="paragrafo-projetos">Renomada estância hidromineral. Famosa pelas águas medicinais, oferece turismo de saúde e lazer.</p>
            </div>
          </div>

          <div className="projetos-card">
            <img src={imgHolambra} alt="Holambra" className="projetos-imagem" />
            <div className="caixa-textos-projeto">
              <h5 className="info-projetos">Moinho Povos Unidos - Holambra - (SP)</h5> <br />
              <p className="paragrafo-projetos">Moinho de vento construído na tradição holandesa, considerado o mais alto da América Latina.</p>
            </div>
          </div>
        </div>
      </section>

      <h2 className="titulo-font cor-titulo tit-dicas container-xxl">Dicas Rápidas para Mochileiros</h2>
      <div className="dicas-lista container-xxl">
        <div className="dica-item"><span>🎒</span> Leve apenas o essencial para facilitar seus deslocamentos.</div>
        <div className="dica-item"><span>💧</span> Tenha sempre uma garrafa de água reutilizável.</div>
        <div className="dica-item"><span>🗺️</span> Baixe mapas offline dos destinos que vai visitar.</div>
        <div className="dica-item"><span>🛏️</span> Pesquise hotéis e acomodações compartilhadas para economizar.</div>
        <div className="dica-item"><span>🌎</span> Respeite a cultura local e preserve o meio ambiente.</div>
      </div>

      <h2 className="container-xxl conheca-index titulo-font cor-titulo">Conheça um pouco sobre a gente!</h2>
      <div className="geral-sobre container-xl mb-5">
        <div className="text-titulo-sobre">
          <div className="titulo-sobre">
            <h2 className="titulo-font cor-titulo">Sobre Nós</h2>
          </div>
          <div className="div-texto-sobre container-sm">
            <p className="p-sobre">
              A Route Books é um guia turístico com a finalidade de ajudar viajantes a encontrar grandes experiências.
              Aqui as pessoas podem deixar os relatos de suas aventuras para ajudar outros viajantes.
            </p>
          </div>
        </div>
        <div className="div-btn-sobre">
          <Link to="/quem-somos" className="text-decoration-none">
            <button className="btn-relatos btn-ver-sobre">Ver Mais &gt;</button>
          </Link>
        </div>
      </div>
    </>
  );
}