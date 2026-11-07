import VerifiedBadge from '../components/VerifiedBadge.jsx';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { comentarPost, getComentarios, getPostById, getUsuariosSeguidos, seguirUsuario, deixarDeSeguirUsuario } from '../api/Route-book.jsx';
import FeedLayout from '../components/FeedLayout.jsx';
import { Avatar, PostActions, PostMedia, PostTags, PostVotes } from '../components/PostCard.jsx';
import { dataRelativa } from '../components/postUtils.js';

export default function PostDetalhes() {
 const {id}=useParams();
 const uid=Number(localStorage.getItem('UsuarioId'))||null;
 const [post,setPost]=useState(null);
 const [comentarios,setComentarios]=useState([]);
 const [erro,setErro]=useState('');
 const [erroComentarios,setErroComentarios]=useState('');
 const [loading,setLoading]=useState(true);
 const [tentativa,setTentativa]=useState(0);
 const [texto,setTexto]=useState('');
 const [resposta,setResposta]=useState(null);
 const [enviando,setEnviando]=useState(false);
 const [ordem,setOrdem]=useState('recentes');
 const [seguindo,setSeguindo]=useState(false);
 const [ocupado,setOcupado]=useState(false);
 const textarea=useRef(null);
 const envio=useRef(false);
 useEffect(()=>{
   let ativo=true;setLoading(true);setErro('');setTexto('');setResposta(null);setComentarios([]);setErroComentarios('');
   getPostById(id).then(r=>{if(ativo)setPost(r.data);}).catch(e=>{if(ativo)setErro(e.response?.status===404?'Publicação não encontrada.':'Não foi possível carregar a publicação.');}).finally(()=>{if(ativo)setLoading(false);});
   getComentarios(id).then(r=>{if(ativo)setComentarios(r.data);}).catch(()=>{if(ativo)setErroComentarios('Não foi possível carregar os comentários.');});
   return ()=>{ativo=false;};
 },[id,tentativa]);
 useEffect(()=>{
   let ativo=true;
   if(uid && post?.usuariosIdUsuario)getUsuariosSeguidos().then(r=>{if(ativo)setSeguindo(r.data.includes(post.usuariosIdUsuario));}).catch(()=>{});
   return ()=>{ativo=false;};
 },[uid,post?.usuariosIdUsuario]);
 const seguir=async()=>{
   if(ocupado)return;setOcupado(true);setErroComentarios('');
   try {if(seguindo)await deixarDeSeguirUsuario(post.usuariosIdUsuario);else await seguirUsuario(post.usuariosIdUsuario);setSeguindo(!seguindo);}
   catch{setErroComentarios('Não foi possível atualizar quem você segue.');}
   finally{setOcupado(false);}
 };
 const comentar=async event=>{
   event.preventDefault();if(envio.current||!texto.trim())return;
   envio.current=true;setEnviando(true);setErroComentarios('');
   try {
     await comentarPost(id,{conteudo:texto.trim(),respostaId:resposta?.idComentario||null});
     setTexto('');setResposta(null);
     setPost(p=>({...p,comentariosCount:(p.comentariosCount||0)+1}));
     try {const res=await getComentarios(id);setComentarios(res.data);}
     catch{setErroComentarios('Comentário enviado. Recarregue a lista para vê-lo.');}
   }catch(e){setErroComentarios(e.response?.data?.mensagem || 'Não foi possível comentar. Seu texto foi mantido.');}
   finally {envio.current=false;setEnviando(false);}
 };
 const responder=c=>{setResposta(c);textarea.current?.focus();};
 const renderComentario=(c,filho=false)=><article className={'detail-comment'+(filho?' reply':'')} key={c.idComentario}>
   <Link to={'/perfil/'+c.autor.idUsuario}><Avatar pessoa={c.autor} small/></Link>
   <div><div className="comment-byline"><Link to={'/perfil/'+c.autor.idUsuario}>{c.autor.nomeCompleto || c.autor.username}<VerifiedBadge pessoa={c.autor}/></Link><small> · {dataRelativa(c.criadoEm)}</small></div><p>{c.conteudo}</p>{uid && <button type="button" onClick={()=>responder(filho?comentarios.find(p=>p.idComentario===c.respostaId):c)}>Responder</button>}
   {!filho && comentarios.filter(r=>r.respostaId===c.idComentario).map(r=>renderComentario(r,true))}</div>
 </article>;
 const principais=comentarios.filter(c=>!c.respostaId).sort((a,b)=>ordem==='recentes'?new Date(b.criadoEm)-new Date(a.criadoEm):new Date(a.criadoEm)-new Date(b.criadoEm));
 return <FeedLayout>
   <Link className="social-back" to="/posts"><i className="fa fa-arrow-left" aria-hidden="true"/> Voltar aos relatos</Link>
   {loading?<div className="feed-state-card">Carregando publicação...</div>:erro?<div className="feed-state-card" role="alert"><p>{erro}</p><button onClick={()=>setTentativa(n=>n+1)}>Tentar novamente</button></div>:post && <>
   <article className="detail-post">
     <header className="detail-author"><Link to={'/perfil/'+post.usuariosIdUsuario}><Avatar pessoa={post.autor}/></Link><div><Link to={'/perfil/'+post.usuariosIdUsuario}><strong>{post.autor?.nomeCompleto || 'Aventureiro'}<VerifiedBadge pessoa={post.autor}/></strong></Link><small>@{post.autor?.username || 'viajante'} · {dataRelativa(post.dataCriacao)}</small></div>{uid!==post.usuariosIdUsuario && (uid?<button className="social-green-button" disabled={ocupado} onClick={seguir}>{seguindo?'Seguindo':'Seguir'}</button>:<Link className="social-green-button" to="/login">Seguir</Link>)}</header>
     <h1>{post.titulo}</h1><PostTags post={post}/>
     <p className="detail-story">{post.conteudo || post.resumo}</p>
     <PostMedia post={post} detail/>
     <PostActions key={post.idPost} post={post}><PostVotes post={post} horizontal onChange={v=>setPost(p=>({...p,...v}))}/></PostActions>
   </article>
   <section id="comentarios" className="detail-comment-composer">
     {uid?<form onSubmit={comentar}><label htmlFor="novo-comentario">Comentar como <strong>{localStorage.getItem('NomeUsuario') || 'aventureiro'}</strong></label>{resposta && <p className="reply-label">Respondendo a {resposta.autor.nomeCompleto}<button type="button" onClick={()=>setResposta(null)}>Cancelar</button></p>}<textarea id="novo-comentario" ref={textarea} value={texto} onChange={e=>setTexto(e.target.value)} maxLength={3000} rows={3} required placeholder="Participe da conversa..." disabled={enviando}/><div className="comment-submit"><small>{texto.length}/3000</small><button className="social-green-button" disabled={enviando||!texto.trim()}>{enviando?'Enviando...':'Comentar'}</button></div></form>:<p><Link to="/login">Entre na sua conta</Link> para participar da conversa.</p>}
   </section>
   {erroComentarios && <p className="feed-toast" role="alert">{erroComentarios} <button onClick={()=>getComentarios(id).then(r=>{setComentarios(r.data);setErroComentarios('');}).catch(()=>{})}>Recarregar comentários</button></p>}
   <div className="comments-heading"><h2>Comentários ({post.comentariosCount||0})</h2><label>Ordenar por: <select value={ordem} onChange={e=>setOrdem(e.target.value)}><option value="recentes">Mais recentes</option><option value="antigos">Mais antigos</option></select></label></div>
   <div className="detail-comments">{principais.map(c=>renderComentario(c))}{!comentarios.length && !erroComentarios && <p className="feed-side-empty">Seja o primeiro a comentar esta aventura.</p>}</div>
   </>}
 </FeedLayout>;
}
