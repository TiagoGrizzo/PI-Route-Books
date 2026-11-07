import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSessao } from '../api/Route-book.jsx';
export default function SessionGate({children}) {
 const location=useLocation(), navigate=useNavigate();
 const [ready,setReady]=useState(false),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{
  let alive=true;
  const clear=()=>{localStorage.removeItem('UsuarioId');localStorage.removeItem('NomeUsuario');};
  getSessao().then(r=>{if(!alive)return;localStorage.setItem('UsuarioId',r.data.usuarioId);localStorage.setItem('NomeUsuario',r.data.nome||'');setReady(true);}).catch(e=>{
   if(!alive)return;
   if(e.response?.status===401){clear();setReady(true);if(location.pathname==='/perfil'||location.pathname==='/posts/criar')navigate('/login?voltar='+encodeURIComponent(location.pathname),{replace:true});}
   else setError(true);
  });
  return()=>{alive=false;};
 },[retry]);
 useEffect(()=>{
  const expired=()=>{setReady(false);navigate('/login?voltar='+encodeURIComponent(location.pathname+location.search)+'&sessao=expirada',{replace:true});setRetry(n=>n+1);};
  window.addEventListener('routebooks-session-expired',expired);
  return()=>window.removeEventListener('routebooks-session-expired',expired);
 },[location.pathname,location.search,navigate]);
 if(error&&!ready)return <div role="alert" style={{padding:32}}>Não foi possível verificar sua sessão. Confira se o backend está ligado. <button onClick={()=>{setError(false);setRetry(n=>n+1);}}>Tentar novamente</button></div>;
 return ready?children:<div role="status" style={{padding:32}}>Verificando sua sessão...</div>;
}
