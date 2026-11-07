import PhotoSelection, { validarMidias } from './PhotoSelection.jsx';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPost, getCreatePostData } from '../api/Route-book.jsx';

function iniciais(nome = '') {
  return nome.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase() || 'A';
}

export default function PostComposer({ usuarioId, nomeUsuario, fotoUsuario, aberto, onAbertoChange, onPublicado }) {
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [erroOpcoes, setErroOpcoes] = useState('');
  const [midia, setMidia] = useState([]);
  const [localizacao, setLocalizacao] = useState('');
  const [mostrarLocal, setMostrarLocal] = useState(false);
  const [avaliacao, setAvaliacao] = useState(0);
  const [mostrarAvaliacao, setMostrarAvaliacao] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [publicando, setPublicando] = useState(false);
  const envioRef = useRef(false);
  const arquivoRef = useRef(null);

  useEffect(() => {
    if (!usuarioId) return;
    let ativo = true;
    setCarregandoOpcoes(true);
    setErroOpcoes('');
    getCreatePostData()
      .then((res) => {
        if (!ativo) return;
        const categoriasDisponiveis = Array.isArray(res.data?.categorias) ? res.data.categorias : [];
        const tiposDisponiveis = Array.isArray(res.data?.tipos) ? res.data.tipos : [];
        setCategorias(categoriasDisponiveis);
        setTipos(tiposDisponiveis);
        if (!categoriasDisponiveis.length || !tiposDisponiveis.length)
          setErroOpcoes('Os tipos e as categorias de viagem ainda não estão disponíveis.');
      })
      .catch(() => { if (ativo) setErroOpcoes('Não foi possível carregar os tipos e as categorias. Tente novamente.'); })
      .finally(() => { if (ativo) setCarregandoOpcoes(false); });
    return () => { ativo = false; };
  }, [usuarioId, tentativa]);

  const abrirAcao = (acao) => {
    if (publicando) return;
    onAbertoChange(true);
    if (!usuarioId) return;
    if (acao === 'midia') arquivoRef.current?.click();
    if (acao === 'local') setMostrarLocal(true);
    if (acao === 'avaliacao') setMostrarAvaliacao(true);
  };

  const selecionarMidia = event => {
    const novos=Array.from(event.target.files||[]);event.target.value='';
    if(!novos.length)return;
    const escolhidos=[...midia,...novos];const erroMidia=validarMidias(escolhidos);
    if(erroMidia){setErro(erroMidia);return;}setErro('');setMidia(escolhidos);
  };

  const publicar = async (event) => {
    event.preventDefault();
    if (envioRef.current || !usuarioId) return;
    setErro('');
    setSucesso('');
    if (!titulo.trim() || !conteudo.trim()) { setErro('Preencha o título e o relato da viagem.'); return; }
    if (!tipoId || !categoriaId) { setErro('Selecione o tipo de viagem e a categoria.'); return; }

    const dados = new FormData();
    Object.entries({
      Titulo: titulo.trim(), Resumo: resumo.trim(), Conteudo: conteudo.trim(),
      TiposIdTipo: tipoId, CategoriasIdCategoria: categoriaId, acao: 'publicar',
      Localizacao: mostrarLocal ? localizacao.trim() : ''
    }).forEach(([campo, valor]) => dados.append(campo, valor));
    if (mostrarAvaliacao && avaliacao) dados.append('AvaliacaoLugar', String(avaliacao));
    midia.forEach(arquivo=>dados.append('fotosPost',arquivo));

    envioRef.current = true;
    setPublicando(true);
    try {
      const response = await createPost(dados);
      onPublicado?.({
        ...response.data.post,
        categoriaRef: categorias.find((item) => String(item.id) === categoriaId),
        tipoRef: { nomeTipo: tipos.find((item) => String(item.id) === tipoId)?.nome }
      });
      setTitulo(''); setResumo(''); setConteudo(''); setTipoId(''); setCategoriaId('');
      setMidia([]); setLocalizacao(''); setMostrarLocal(false);
      setAvaliacao(0); setMostrarAvaliacao(false);
      setSucesso('Publicação compartilhada no feed.');
      onAbertoChange(false);
    } catch (err) {
      const validacao = Object.values(err.response?.data?.errors || {}).flat().join(' ');
      setErro(err.response?.data?.mensagem || validacao || (err.response?.status === 401
        ? 'Sua sessão expirou. Entre novamente para publicar.'
        : 'Não foi possível publicar. Seu texto foi mantido para tentar novamente.'));
    } finally {
      envioRef.current = false;
      setPublicando(false);
    }
  };

  const acoes = (
    <div className="feed-composer-actions">
      <button type="button" disabled={publicando} onClick={() => abrirAcao('midia')}><i className="fa fa-picture-o" aria-hidden="true"></i> Fotos/Vídeo</button>
      <button type="button" disabled={publicando} onClick={() => abrirAcao('local')}><i className="fa fa-map-marker" aria-hidden="true"></i> Adicionar local</button>
      <button type="button" disabled={publicando} onClick={() => abrirAcao('avaliacao')}><i className="fa fa-star" aria-hidden="true"></i> Avaliar lugar</button>
      {aberto && <Link to={usuarioId ? '/posts/criar' : '/login'}>Formulário completo</Link>}
    </div>
  );

  return (
    <section id="feed-composer" className={'feed-composer' + (aberto ? ' is-open' : '')} aria-label="Criar publicação">
      <button className="feed-composer-prompt feed-composer-open" type="button" disabled={publicando} aria-expanded={aberto} aria-controls="feed-composer-content" onClick={() => onAbertoChange(!aberto)}>
        {fotoUsuario ? <img className="feed-avatar feed-avatar-photo" src={fotoUsuario} alt="" /> : <span className="feed-avatar">{iniciais(nomeUsuario)}</span>}
        <span>{aberto ? 'Compartilhe sua aventura' : 'O que você explorou hoje?'}</span>
        {aberto && <i className="fa fa-angle-up" aria-hidden="true"></i>}
      </button>

      {aberto && usuarioId ? (
        <form id="feed-composer-content" className="feed-composer-form" onSubmit={publicar}>
          <fieldset disabled={publicando}>
            <input className="feed-composer-title feed-composer-writing" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Dê um título para sua aventura..." maxLength="150" required aria-label="Título da aventura" />
            <input className="feed-composer-writing" value={resumo} onChange={(e) => setResumo(e.target.value)} placeholder="Adicione um breve resumo..." maxLength="300" aria-label="Resumo da publicação" />
            <textarea className="feed-composer-writing" value={conteudo} onChange={(e) => setConteudo(e.target.value)} placeholder="O que você explorou hoje?" rows="3" required aria-label="Relato da viagem" />
            <div className="feed-composer-selects">
              <select value={tipoId} onChange={(e) => setTipoId(e.target.value)} required disabled={carregandoOpcoes} aria-label="Tipo de viagem"><option value="">Tipo de Viagem</option>{tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>)}</select>
              <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required disabled={carregandoOpcoes} aria-label="Categoria"><option value="">Categoria</option>{categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}</select>
            </div>
            {erroOpcoes && <div className="feed-composer-message error" role="alert">{erroOpcoes} <button type="button" onClick={() => setTentativa((atual) => atual + 1)}>Tentar novamente</button></div>}
            {!!midia.length && <PhotoSelection files={midia} onRemove={i=>setMidia(lista=>lista.filter((_,j)=>j!==i))}/>}
            {mostrarLocal && <div className="feed-composer-location"><i className="fa fa-map-marker" aria-hidden="true"></i><input className="feed-composer-writing" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} placeholder="Onde foi essa aventura?" maxLength="180" aria-label="Local da aventura" /><button type="button" onClick={() => { setMostrarLocal(false); setLocalizacao(''); }} aria-label="Remover local">×</button></div>}
            {mostrarAvaliacao && <div className="feed-composer-rating" role="group" aria-label="Avaliação do lugar"><span>Avalie o lugar:</span>{[1, 2, 3, 4, 5].map((nota) => <button key={nota} type="button" className={nota <= avaliacao ? 'selected' : ''} aria-pressed={nota === avaliacao} onClick={() => setAvaliacao(nota)} aria-label={nota + (nota === 1 ? ' estrela' : ' estrelas')}><i className="fa fa-star" aria-hidden="true"></i></button>)}<button className="feed-composer-clear-rating" type="button" onClick={() => { setAvaliacao(0); setMostrarAvaliacao(false); }}>Limpar</button></div>}
            {acoes}
            {erro && <p className="feed-composer-message error" role="alert">{erro}{erro.includes('sessão expirou') && <> <Link to="/login">Entrar</Link></>}</p>}
            <div className="feed-composer-submit"><span>Até 10 fotos de 5 MB cada ou um vídeo de até 20 MB.</span><button className="feed-create-link" type="submit" disabled={publicando || carregandoOpcoes || !categorias.length || !tipos.length}>{publicando ? 'Publicando...' : 'Publicar relato'}</button></div>
          </fieldset>
        </form>
      ) : (
        <div id="feed-composer-content">
          {aberto && <p className="feed-composer-auth"><Link to="/login">Entre na sua conta</Link> para publicar ou <Link to="/cadastro">cadastre-se</Link>.</p>}
          {acoes}
        </div>
      )}
      {sucesso && <p className="feed-composer-message success" role="status">{sucesso}</p>}
      <input ref={arquivoRef} className="feed-composer-file" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov" onChange={selecionarMidia} />
    </section>
  );
}
