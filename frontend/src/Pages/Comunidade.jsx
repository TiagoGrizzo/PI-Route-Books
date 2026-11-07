import VerifiedBadge from '../components/VerifiedBadge.jsx';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FeedLayout from '../components/FeedLayout.jsx';
import CommunityImage from '../components/CommunityImage.jsx';
import PostCard from '../components/PostCard.jsx';
import { getComunidade, participarComunidade } from '../api/Route-book.jsx';
export default function Comunidade(){
 const {slug}=useParams();
 const [data,setData]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[busy,setBusy]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{let alive=true;setData(null);setLoading(true);setError('');getComunidade(slug).then(r=>{if(alive)setData(r.data);}).catch(e=>{if(alive)setError(e.response?.status===404?'Comunidade não encontrada.':'Não foi possível carregar a comunidade.');}).finally(()=>{if(alive)setLoading(false);});return()=>{alive=false;};},[slug,retry]);
 async function participar(){if(busy)return;setBusy(true);setError('');try{const r=await participarComunidade(slug,!data.comunidade.participando);setData(d=>({...d,comunidade:{...d.comunidade,...r.data}}));}catch(e){setError(e.response?.data?.mensagem||'Não foi possível atualizar sua participação.');}finally{setBusy(false);}}
 return <FeedLayout posts={data?.posts}>{loading?<div className="feed-state-card">Carregando comunidade...</div>:<>
 {error&&<p className="feed-toast" role="alert">{error} <button onClick={()=>setRetry(r=>r+1)}>Tentar novamente</button></p>}
 {data&&<><section className="feed-state-card community-heading"><CommunityImage comunidade={data.comunidade} large /><div><h1>{data.comunidade.nome}<VerifiedBadge comunidade={data.comunidade}/></h1><p>{data.comunidade.descricao}</p><small>{data.comunidade.membrosCount} membros · {data.posts.length} relatos</small></div>{localStorage.getItem('UsuarioId')?<button className="social-green-button" onClick={participar} disabled={busy}>{busy?'Salvando...':data.comunidade.participando?'Sair da comunidade':'Participar'}</button>:<Link className="social-green-button" to={'/login?voltar='+encodeURIComponent('/comunidades/'+slug)}>Participar</Link>}</section>
 <div className="feed-post-list">{data.posts.map(p=><PostCard key={p.idPost} post={p} onChange={updated=>setData(d=>({...d,posts:d.posts.map(item=>item.idPost===updated.idPost?updated:item)}))}/>)}{!data.posts.length&&<div className="feed-state-card">Ainda não há relatos nesta comunidade.</div>}</div></>}
 </>}</FeedLayout>;
}
