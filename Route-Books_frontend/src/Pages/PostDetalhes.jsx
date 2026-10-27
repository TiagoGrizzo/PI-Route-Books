import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostById } from '../api/Route-book.jsx';
import '../assets/css/posts.css';

export default function PostDetalhes() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro('');

    getPostById(id)
      .then((res) => {
        if (!ativo) return;
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (!ativo) return;
        setErro('Post não encontrado.');
        setLoading(false);
      });

    return () => { ativo = false; };
  }, [id]);

  if (loading) {
    return (
      <section className="container-post">
        <div className="conteudo-geral-post">
          <p>Carregando postagem...</p>
        </div>
      </section>
    );
  }

  if (erro || !post) {
    return (
      <section className="container-post">
        <div className="conteudo-geral-post">
          <h3 className="titulo-font cor-titulo">{erro || 'Post não encontrado.'}</h3>
          <Link to="/posts" className="btn-relatos">Voltar para os posts</Link>
        </div>
      </section>
    );
  }

  const autorNome = post.autor?.nomeCompleto || post.autor?.username || 'Aventureiro';
  return (
    <section className="post-details">
      <h1>Details</h1>
      <h2>Detalhes do Post</h2>
      <hr />
      <dl className="post-details-list">
        <dt>Título</dt><dd>{post.titulo}</dd>
        <dt>Resumo</dt><dd>{post.resumo}</dd>
        <dt>Conteúdo</dt><dd>{post.conteudo}</dd>
        <dt>Categoria</dt><dd>{post.categoria?.nome || post.categorias?.nome || 'Relato'}</dd>
        <dt>Tipo de Post</dt><dd>{post.tipo?.nome || post.tipos?.nome || 'Viagem'}</dd>
        <dt>Autor</dt><dd>{post.autor?.username || autorNome}</dd>
        <dt>Status</dt><dd>{post.status || 'Ativo'}</dd>
      </dl>
      <div className="post-details-links"><a href="#" onClick={(e) => e.preventDefault()}>Edit</a> | <Link to="/posts">Back to List</Link></div>
    </section>
  );
}
