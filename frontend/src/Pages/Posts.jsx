import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUltimosPosts, getPerfilPublico } from '../api/Route-book.jsx';
import FeedLayout from '../components/FeedLayout.jsx';
import PostComposer from '../components/PostComposer.jsx';
import PostCard from '../components/PostCard.jsx';
import { lerSalvos, urlDaApi } from '../components/postUtils.js';
export default function Posts() {
 const [params,setParams]=useSearchParams();
 const busca=(params.get('busca')||'').trim();
 const aba=params.get('aba')||'para-voce';
 const [posts,setPosts]=useState([]);
 const [loading,setLoading]=useState(true);
 const [erro,setErro]=useState('');
 const [tentativa,setTentativa]=useState(0);
 const [perfil,setPerfil]=useState(null);
 const [salvos,setSalvos]=useState(lerSalvos);
 const [aberto,setAberto]=useState(params.get('criar')==='1');
 const uid=Number(localStorage.getItem('UsuarioId'))||null;
 useEffect(()=>{
   let ativo=true;setLoading(true);setErro('');
   getUltimosPosts(busca).then(r=>{if(ativo)setPosts(r.data);}).catch(()=>{if(ativo)setErro('Não foi possível carregar as publicações. Confira se a API está disponível e tente novamente.');}).finally(()=>{if(ativo)setLoading(false);});
   return ()=>{ativo=false;};
 },[busca,tentativa]);
 useEffect(()=>{if(uid)getPerfilPublico(uid).then(r=>setPerfil(r.data)).catch(()=>{});},[uid]);
 useEffect(()=>{const atualizar=()=>setSalvos(lerSalvos());window.addEventListener('routebooks-salvos',atualizar);return ()=>window.removeEventListener('routebooks-salvos',atualizar);},[]);
 const abrir=()=>{setAberto(true);document.getElementById('feed-composer')?.scrollIntoView({behavior:'smooth',block:'center'});};
 const selecionar=value=>{const next=new URLSearchParams(params);next.set('aba',value);setParams(next);};
 const atualizar=post=>setPosts(lista=>lista.map(p=>p.idPost===post.idPost?post:p));
 const visiveis=useMemo(()=>{
   if(aba==='meus')return posts.filter(p=>p.usuariosIdUsuario===uid);
   if(aba==='salvos')return posts.filter(p=>salvos.includes(p.idPost));
   if(aba==='curtidos')return [...posts].sort((a,b)=>b.curtidasCount-a.curtidasCount);
   if(aba==='perto')return posts.filter(p=>(perfil?.cidade && p.autor?.cidade===perfil.cidade)||(perfil?.uf && p.autor?.uf===perfil.uf));
   return posts;
 },[posts,aba,uid,salvos,perfil]);
 return <FeedLayout posts={posts} aba={aba} onSelect={selecionar} onCreate={abrir}>
   <div className="feed-tabs" role="group" aria-label="Ordenação do feed">{[['para-voce','Para você'],['curtidos','Mais curtidas'],['perto','Perto de mim']].map(([id,label])=><button key={id} className={aba===id?'active':''} onClick={()=>selecionar(id)} aria-pressed={aba===id}>{label}{id==='perto' && <i className="fa fa-map-marker" aria-hidden="true"/>}</button>)}</div>
   <PostComposer usuarioId={uid} nomeUsuario={perfil?.nomeCompleto || localStorage.getItem('NomeUsuario') || 'Aventureiro'} fotoUsuario={urlDaApi(perfil?.fotoPerfil)} aberto={aberto} onAbertoChange={setAberto} onPublicado={p=>setPosts(lista=>[{...p,autor:perfil,curtidasCount:0,downvotesCount:0,meuVoto:0,comentariosCount:0},...lista])}/>
   {busca && <p className="feed-search-summary">Resultados para <strong>“{busca}”</strong></p>}
   {loading?<div className="feed-state-card">Carregando relatos...</div>:erro?<div className="feed-state-card" role="alert"><p>{erro}</p><button onClick={()=>setTentativa(n=>n+1)}>Tentar novamente</button></div>:visiveis.length?<div className="feed-post-list">{visiveis.map(p=><PostCard key={p.idPost} post={p} onChange={atualizar}/>)}</div>:<div className="feed-state-card feed-empty-state"><i className="fa fa-map-o" aria-hidden="true"/><h2>{aba==='salvos'?'Nenhum relato salvo':aba==='meus'?'Seus relatos aparecerão aqui':busca?'Nenhum relato encontrado':'A estrada está esperando por você'}</h2><p>{aba==='perto'?'Complete sua localização no perfil para encontrar viagens próximas.':'Compartilhe sua aventura com a comunidade Route Books.'}</p><button onClick={abrir}>Criar publicação</button></div>}
 </FeedLayout>;
}
