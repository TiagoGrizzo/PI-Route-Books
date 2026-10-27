import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/index.css'; 
import '../assets/css/posts.css'; 
import '../assets/css/criarpost.css';
import { getCreatePostData, createPost } from '../api/Route-book.jsx'; 

export default function CriarPost() {
  const navigate = useNavigate();
  
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [foto, setFoto] = useState(null);
  
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        const response = await getCreatePostData();
        const { rascunho, categorias, tipos } = response.data;

        setCategorias(categorias);
        setTipos(tipos);

        if (rascunho) {
          setTitulo(rascunho.titulo || '');
          setResumo(rascunho.resumo || '');
          setConteudo(rascunho.conteudo || '');
          setTipoId(rascunho.tiposIdTipo || '');
          setCategoriaId(rascunho.categoriasIdCategoria || '');
        }
      } catch (err) {
        console.error("Erro ao carregar dados da página de criação:", err);
        setErro("Não foi possível carregar as opções de categoria e tipo.");
      }
    }

    carregarDadosIniciais();
  }, []);

  // Modificamos a função para receber a ação ("publicar" ou "rascunho")
  const handleSubmit = async (e, acaoDesejada) => {
    e.preventDefault();
    
    if (foto && foto.size > 5242880) {
      alert("A imagem é muito grande! Escolha uma foto de até 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append('Titulo', titulo);
    formData.append('Resumo', resumo);
    formData.append('Conteudo', conteudo);
    formData.append('TiposIdTipo', tipoId);
    formData.append('CategoriasIdCategoria', categoriaId);
    formData.append('acao', acaoDesejada); // Envia para o C# saber se é "rascunho" ou "publicar"
    
    if (foto) {
      formData.append('fotoPost', foto);
    }

    try {
      const response = await createPost(formData);
      alert(response.data.mensagem || 'Operação realizada com sucesso!');
      navigate('/');
    } catch (err) {
      console.error('Erro ao salvar post:', err);
      setErro('Não foi possível salvar o post. Verifique os campos.');
    }
  };

  return (
    <section className="criar-post-page">
      <section className="cad-post-box" aria-labelledby="criar-post-titulo">
        <header className="criar-post-header">
          <h1 id="criar-post-titulo">Compartilhe sua Aventura!</h1>
        </header>

        {erro && <div className="criar-post-alert" role="alert">{erro}</div>}

        <form className="criar-post-form" onSubmit={(e) => handleSubmit(e, 'publicar')} encType="multipart/form-data">
          <div className="criar-post-field">
            <label htmlFor="titulo-post">Título da postagem</label>
            <input
                id="titulo-post"
                type="text" 
                className="criar-post-control"
                placeholder="Dê um título chamativo..." 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
          </div>

          <div className="criar-post-field">
            <label htmlFor="resumo-post">Resumo</label>
            <input
                id="resumo-post"
                type="text" 
                className="criar-post-control"
                placeholder="Um breve resumo do que se trata..." 
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
              />
          </div>

          <div className="criar-post-field">
            <label htmlFor="conteudo-post">Relato da viagem</label>
            <textarea
                id="conteudo-post"
                className="criar-post-control criar-post-textarea"
                placeholder="Conte os detalhes da sua aventura aqui..."
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                required
              ></textarea>
          </div>

          <div className="criar-post-taxonomia">
              <div className="criar-post-field">
                <label htmlFor="tipo-viagem">Tipo de viagem</label>
                <select 
                  id="tipo-viagem"
                  className="criar-post-control"
                  value={tipoId}
                  onChange={(e) => setTipoId(e.target.value)}
                >
                  <option value="">-- Selecione o Tipo --</option>
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>

              <div className="criar-post-field">
                <label htmlFor="categoria-post">Categoria</label>
                <select 
                  id="categoria-post"
                  className="criar-post-control"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                >
                  <option value="">-- Selecione a Categoria --</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
          </div>

          <div className="criar-post-field criar-post-upload">
              <label htmlFor="foto-post">Adicionar uma Foto (Máx. 5MB - Apenas 1 imagem)</label>
              <input 
                id="foto-post"
                type="file" 
                className="criar-post-control"
                accept=".jpg,.jpeg,.png,.webp" 
                onChange={(e) => setFoto(e.target.files[0])} 
              />
              <small>Formatos aceitos: JPG, PNG, WEBP.</small>
          </div>

          <footer className="criar-post-actions">
              <Link to="/posts" className="criar-post-back">Voltar ao feed</Link>
              <div className="criar-post-buttons">
                <button 
                  type="button" 
                  className="criar-post-button criar-post-draft"
                  onClick={(e) => handleSubmit(e, 'rascunho')}
                >
                  Salvar Rascunho
                </button>

                <button type="submit" className="criar-post-button criar-post-publish">
                  Publicar Relato
                </button>
              </div>
          </footer>
        </form>
      </section>
    </section>
  );
}