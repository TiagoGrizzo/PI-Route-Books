import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../assets/css/style.css';
import '../assets/css/color.css';
import '../assets/css/verposts.css';
import { getUltimosPosts } from '../api/Route-book.jsx';

export default function Posts() {
  const [searchParams] = useSearchParams();
  const busca = (searchParams.get('busca') || '').trim();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;

    setLoading(true);

    getUltimosPosts(busca)
      .then((res) => {
        if (!ativo) return;
        setPosts(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        if (!ativo) return;
        setPosts([]);
        setLoading(false);
      });

    return () => { ativo = false; };
  }, [busca]);

  return (
    <section className="sec-posts container-xxl">
      <div className="titulo-posts">
        <h3 className="titulo-font cor-titulo">
          {busca ? 'Resultados da pesquisa!' : 'Veja os posts de outros aventureiros!'}
        </h3>
      </div>

      <div className="container-posts">
        {loading ? (
          <p style={{ textAlign: 'center', color: '#fff' }}>Carregando postagens...</p>
        ) : posts.length > 0 ? (
          posts.map((p) => (
            <div className="relato-posts" key={p.idPost}>
              <div className="conteudo-card-index">
                <h3 className="titulo-font cor-titulo">{p.titulo}</h3>
                <p>{p.resumo}</p>

                <div className="post-info-index">
                  <span>
                    Por {p.autor?.nomeCompleto || p.autor?.username || 'Aventureiro'} • {new Date(p.dataCriacao).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="div-btn-relatos">
                <Link to={`/posts/detalhes/${p.idPost}`}>
                  <button className="btn-relatos">Ver Mais</button>
                </Link>
              </div>
            </div>
          ))
        ) : busca ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h3 className="titulo-font cor-titulo">Nenhum resultado encontrado</h3>
            <p>
              Não encontramos nenhum post relacionado a <strong>"{busca}"</strong>.
            </p>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#fff' }}>
            Ainda não há postagens. Seja o primeiro a compartilhar sua aventura!
          </p>
        )}
      </div>
    </section>
  );
}
