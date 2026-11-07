import VerifiedBadge from '../components/VerifiedBadge.jsx';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { editarPerfil, getPerfilPublico, getPostsPerfil, seguirUsuario, deixarDeSeguirUsuario } from '../api/Route-book.jsx';
import ProfilePhotoInput from '../components/ProfilePhotoInput.jsx';
import FeedLayout from '../components/FeedLayout.jsx';
import PostCard, { Avatar } from '../components/PostCard.jsx';
import { urlDaApi } from '../components/postUtils.js';

export default function Perfil() {
 const {id:routeId}=useParams();
 const uid=Number(localStorage.getItem('UsuarioId'))||null;
 const id=Number(routeId)||uid;
 const proprio=id===uid;
 const [perfil,setPerfil]=useState(null);
 const [posts,setPosts]=useState([]);
 const [aba,setAba]=useState('posts');
 const [loading,setLoading]=useState(true);
 const [loadingPosts,setLoadingPosts]=useState(false);
 const [erro,setErro]=useState('');
 const [erroPosts,setErroPosts]=useState('');
 const [tentativa,setTentativa]=useState(0);
 const [editando,setEditando]=useState(false);
 const [salvando,setSalvando]=useState(false);
 const [form,setForm]=useState({});
 const [erroEdicao,setErroEdicao]=useState('');
 const [ocupado,setOcupado]=useState(false);
 const lock=useRef(false);
 useEffect(()=>{if(editando)document.querySelector('.profile-editor')?.scrollIntoView({behavior:'smooth',block:'center'});},[editando]);
 useEffect(()=>{
   let ativo=true;setPerfil(null);setEditando(false);setErro('');setLoading(true);
   if(!id){setLoading(false);return;}
   getPerfilPublico(id).then(r=>{if(ativo)setPerfil(r.data);}).catch(()=>{if(ativo)setErro('Não foi possível carregar este perfil.');}).finally(()=>{if(ativo)setLoading(false);});
   return ()=>{ativo=false;};
 },[id,tentativa]);
 useEffect(()=>{
   let ativo=true;setPosts([]);setErroPosts('');
   if(!id)return;
   setLoadingPosts(true);
   getPostsPerfil(id,aba).then(r=>{if(ativo)setPosts(r.data);}).catch(()=>{if(ativo)setErroPosts('Não foi possível carregar as publicações.');}).finally(()=>{if(ativo)setLoadingPosts(false);});
   return ()=>{ativo=false;};
 },[id,aba,tentativa]);
 const editar=()=>{setForm({nomeCompleto:perfil.nomeCompleto||'',biografia:perfil.biografia||'',cidade:perfil.cidade||'',uf:perfil.uf||'',pais:perfil.pais||''});setErroEdicao('');setEditando(true);};
 const salvar=async e=>{
   e.preventDefault();if(lock.current)return;lock.current=true;setSalvando(true);setErroEdicao('');
   const dados=new FormData();Object.entries(form).forEach(([k,v])=>{if(v!=null)dados.append(k,v);});
   try {const r=await editarPerfil(dados);setPerfil(r.data);setPosts(lista=>lista.map(p=>p.autor?.idUsuario===r.data.idUsuario?{...p,autor:{...p.autor,nomeCompleto:r.data.nomeCompleto,fotoPerfil:r.data.fotoPerfil}}:p));localStorage.setItem('NomeUsuario',r.data.nomeCompleto);window.dispatchEvent(new CustomEvent('routebooks-profile-updated',{detail:r.data}));setEditando(false);}
   catch(e){setErroEdicao(e.response?.data?.mensagem || 'Não foi possível salvar o perfil. Confira os campos e tente novamente.');}
   finally{lock.current=false;setSalvando(false);}
 };
 const seguir=async()=>{
   if(ocupado)return;setOcupado(true);
   try {if(perfil.seguindo)await deixarDeSeguirUsuario(id);else await seguirUsuario(id);setPerfil(p=>({...p,seguindo:!p.seguindo,seguidoresCount:p.seguidoresCount+(p.seguindo?-1:1)}));}
   catch{setErroEdicao('Não foi possível atualizar quem você segue.');}
   finally{setOcupado(false);}
 };
 return <FeedLayout>
   {!id?<div className="feed-state-card"><p>Entre para acessar seu perfil.</p><Link to="/login" className="social-green-button">Entrar</Link></div>:loading?<div className="feed-state-card">Carregando perfil...</div>:erro?<div className="feed-state-card" role="alert"><p>{erro}</p><button onClick={()=>setTentativa(n=>n+1)}>Tentar novamente</button></div>:perfil && <>
     <header className="profile-page-heading"><Link to="/posts" aria-label="Voltar aos posts"><i className="fa fa-arrow-left" aria-hidden="true"/></Link><div><h1>{perfil.nomeCompleto || perfil.username}<VerifiedBadge pessoa={perfil}/></h1><span>{perfil.postsCount} posts</span></div></header>
     <section className="social-profile">
       <div className={'profile-cover'+(!perfil.capaUrl?' no-cover':'')}>{perfil.capaUrl?<img src={urlDaApi(perfil.capaUrl)} alt="Capa do perfil"/>:<i className="fa fa-compass" aria-hidden="true"/>}</div>
       <div className="profile-identity"><div className="profile-avatar">{proprio?<button type="button" className="profile-photo-button" onClick={editar} aria-label="Trocar foto do perfil"><Avatar pessoa={perfil}/><span><i className="fa fa-camera" aria-hidden="true"/></span></button>:<Avatar pessoa={perfil}/>}</div>{proprio?<button className="profile-edit-button" onClick={editar}>Editar perfil</button>:uid?<button className="profile-edit-button" onClick={seguir} disabled={ocupado}>{perfil.seguindo?'Seguindo':'Seguir'}</button>:<Link to="/login" className="profile-edit-button">Seguir</Link>}
         <h2>{perfil.nomeCompleto || perfil.username}<VerifiedBadge pessoa={perfil}/></h2><p className="profile-handle">@{perfil.username}</p><p className="profile-bio">{perfil.biografia || 'Uma nova aventura começa aqui.'}</p>
         <div className="profile-metadata">{(perfil.cidade || perfil.pais) && <span><i className="fa fa-map-marker" aria-hidden="true"/> {[perfil.cidade,perfil.uf,perfil.pais].filter(Boolean).join(', ')}</span>}<span><i className="fa fa-calendar" aria-hidden="true"/> Membro desde {new Date(perfil.criadoEm).toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</span></div>
         <div className="profile-counts"><span><strong>{perfil.seguindoCount}</strong> Seguindo</span><span><strong>{perfil.seguidoresCount}</strong> Seguidores</span></div>
       </div>
       <div className="profile-tabs" role="group" aria-label="Publicações do perfil">{[['posts','Posts'],['midias','Mídias'],['roteiros','Roteiros'],['curtidas','Curtidas']].map(([key,label])=><button key={key} className={aba===key?'active':''} aria-pressed={aba===key} onClick={()=>setAba(key)}>{label}</button>)}</div>
     </section>
     {editando && <section className="profile-editor"><h2>Editar perfil</h2><form onSubmit={salvar}><fieldset disabled={salvando}>{[['nomeCompleto','Nome',100],['biografia','Biografia',500],['cidade','Cidade',100],['uf','Estado (UF)',2],['pais','País',100]].map(([key,label,max])=><label key={key}>{label}{key==='biografia'?<textarea value={form[key]} maxLength={max} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>:<input required={key==='nomeCompleto'} value={form[key]} maxLength={max} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>}</label>)}<ProfilePhotoInput label="Foto do perfil" file={form.foto} current={urlDaApi(perfil.fotoPerfil)} onChange={foto=>setForm(f=>({...f,foto}))}/><ProfilePhotoInput label="Capa do perfil" file={form.capa} current={urlDaApi(perfil.capaUrl)} onChange={capa=>setForm(f=>({...f,capa}))}/><small>JPG, PNG ou WEBP; até 5 MB por imagem.</small><div className="profile-editor-actions"><button type="button" onClick={()=>setEditando(false)}>Cancelar</button><button className="social-green-button" type="submit">{salvando?'Salvando...':'Salvar alterações'}</button></div></fieldset></form></section>}
     {erroEdicao && <p role="alert" className="feed-toast">{erroEdicao}</p>}
     {aba==='roteiros' && <p className="feed-side-empty">Relatos com local adicionado.</p>}
     {loadingPosts?<div className="feed-state-card">Carregando relatos...</div>:erroPosts?<div className="feed-state-card" role="alert">{erroPosts}<button onClick={()=>setTentativa(n=>n+1)}>Tentar novamente</button></div>:posts.length?<div className="feed-post-list">{posts.map(p=><PostCard key={p.idPost} post={p} onChange={novo=>setPosts(lista=>lista.map(item=>item.idPost===novo.idPost?novo:item).filter(item=>aba!=='curtidas'||!proprio||item.idPost!==novo.idPost||novo.meuVoto===1))}/>)}</div>:<div className="feed-state-card">Nenhuma publicação nesta aba ainda.</div>}
   </>}
 </FeedLayout>;
}
