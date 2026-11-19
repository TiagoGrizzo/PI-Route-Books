import VerifiedBadge from './VerifiedBadge.jsx';
import PostMediaGallery from './PostMediaGallery.jsx';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { votarPost } from '../api/Route-book.jsx';
import { dataRelativa, iniciais, lerSalvos, urlDaApi } from './postUtils.js';

export function Avatar({ pessoa, small = false }) {
  const nome = pessoa?.nomeCompleto || pessoa?.username || 'Aventureiro';
  return pessoa?.fotoPerfil ? <img className={'feed-avatar feed-avatar-photo' + (small ? ' feed-avatar-small' : '')} src={urlDaApi(pessoa.fotoPerfil)} alt="" /> : <span className={'feed-avatar' + (small ? ' feed-avatar-small' : '')}>{iniciais(nome)}</span>;
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
  return <div className={'post-votes' + (horizontal ? ' horizontal' : '')} role="group" aria-label="Votos da publicação">
    <button type="button" disabled={busy} onClick={() => votar(1)} aria-label={post.meuVoto === 1 ? 'Remover curtida' : 'Curtir publicação'} aria-pressed={post.meuVoto === 1} className={'post-upvote' + (post.meuVoto === 1 ? ' selected' : '') + (animacao ? ' takeoff' : '')} onAnimationEnd={() => setAnimacao(false)}><i className="fa fa-plane" aria-hidden="true" /></button>
    <span className="vote-count" aria-label={(post.curtidasCount || 0) + ' curtidas'}>{post.curtidasCount || 0}<small>curtidas</small></span>
    <button type="button" disabled={busy} onClick={() => votar(-1)} aria-label={post.meuVoto === -1 ? 'Remover downvote' : 'Dar downvote'} aria-pressed={post.meuVoto === -1} className={'post-downvote' + (post.meuVoto === -1 ? ' selected' : '')}><i className="fa fa-arrow-down" aria-hidden="true" /></button>
    <span className="vote-count down-count" aria-label={(post.downvotesCount || 0) + ' downvotes'}>{post.downvotesCount || 0}<small>downvotes</small></span>
    {erro && <span className="vote-error" role="alert">{erro}</span>}
  </div>;
}
export function PostActions({ post, children }) {
  const [salvo, setSalvo] = useState(() => lerSalvos().includes(Number(post.idPost)));
  const [mensagem, setMensagem] = useState('');
  const salvar = () => {
    const ids = lerSalvos(); const novo = !ids.includes(Number(post.idPost));
    localStorage.setItem('RouteBooksPostsSalvos', JSON.stringify(novo ? [...ids, Number(post.idPost)] : ids.filter(id => id !== Number(post.idPost))));
    setSalvo(novo); window.dispatchEvent(new Event('routebooks-salvos'));
  };
  const compartilhar = async () => {
    try {
      const url = window.location.origin + '/posts/detalhes/' + post.idPost;
      if (navigator.share) await navigator.share({ title: post.titulo, url });
      else { await navigator.clipboard.writeText(url); setMensagem('Link copiado.'); }
    } catch (e) { if (e.name !== 'AbortError') setMensagem('Não foi possível compartilhar.'); }
  };
  return <><div className="feed-post-actions">{children}<Link to={'/posts/detalhes/' + post.idPost + '#comentarios'}><i className="fa fa-comment-o" aria-hidden="true" /> {post.comentariosCount || 0} Comentários</Link><button type="button" onClick={compartilhar}><i className="fa fa-retweet" aria-hidden="true" /> Compartilhar</button><button type="button" onClick={salvar} aria-pressed={salvo}><i className={'fa ' + (salvo ? 'fa-bookmark' : 'fa-bookmark-o')} aria-hidden="true" /> {salvo ? 'Salvo' : 'Salvar'}</button></div>{mensagem && <p className="post-action-status" role="status">{mensagem}</p>}</>;
}
export function PostMedia({ post, detail = false }) { return <PostMediaGallery post={post} detail={detail} />; }
export function PostTags({ post }) {
  return <div className="feed-post-tags">{post.localizacao && <span><i className="fa fa-map-marker" aria-hidden="true" /> {post.localizacao}</span>}{post.avaliacaoLugar != null && <span className="feed-rating-tag"><i className="fa fa-star" aria-hidden="true" /> {Number(post.avaliacaoLugar).toLocaleString('pt-BR')} / 5</span>}{post.categoriaRef?.nome && <span>{post.categoriaRef.nome}</span>}{post.tipoRef?.nomeTipo && <span>{post.tipoRef.nomeTipo}</span>}</div>;
}
export default function PostCard({ post, onChange }) {
  const autor = post.autor?.nomeCompleto || post.autor?.username || 'Aventureiro';
  return <article className="feed-post-card">
    <div className="feed-post-rail"><PostVotes post={post} onChange={changes => onChange?.({ ...post, ...changes })} /></div>
    <div className="feed-post-content">
      <div className="feed-post-author-row"><Link to={'/perfil/' + post.usuariosIdUsuario}><Avatar pessoa={post.autor} small /></Link><div><Link to={'/posts/detalhes/' + post.idPost} className="feed-post-heading">{post.titulo}</Link><span> · Postado por <Link to={'/perfil/' + post.usuariosIdUsuario}>{autor}<VerifiedBadge pessoa={post.autor} /></Link> · {dataRelativa(post.dataCriacao)}</span></div></div>
      <PostTags post={post} />
      <p className="feed-post-summary">{post.resumo || post.conteudo}</p>
      <PostMedia post={post} />
      {!post.imagemUrl && <Link className="post-read-more" to={'/posts/detalhes/' + post.idPost}>Ler relato completo <i className="fa fa-arrow-right" aria-hidden="true" /></Link>}
      <PostActions post={post} />
    </div>
  </article>;
}
