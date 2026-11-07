import { useEffect, useRef, useState } from 'react';
import { urlDaApi } from './postUtils.js';
export function fotosDoPost(post){
 let fotos=post.imagens;
 if(!Array.isArray(fotos)&&post.imagensJson){try{fotos=JSON.parse(post.imagensJson);}catch{fotos=[];}}
 return [...new Set((Array.isArray(fotos)&&fotos.length?fotos:[post.imagemUrl]).filter(url=>typeof url==='string'&&url.trim()))];
}
export default function PostMediaGallery({post,detail=false}){
 const fotos=fotosDoPost(post),[indice,setIndice]=useState(null),dialog=useRef(null);
 useEffect(()=>{if(indice!==null){dialog.current?.showModal();}else dialog.current?.close();},[indice]);
 const mudar=delta=>setIndice(i=>(i+delta+fotos.length)%fotos.length);
 if(!fotos.length)return null;
 if(post.tipoMidia==='video')return <div className={'post-video'+(detail?' detail-video':'')}><video src={urlDaApi(post.imagemUrl)} controls preload="metadata" aria-label={'Vídeo de '+post.titulo}/></div>;
 const visiveis=detail?fotos:fotos.slice(0,4);
 return <div className={'post-gallery'+(detail?' post-gallery-detail':'')+(post.imagemFonteUrl?' post-gallery-credit':'')}>
  <div className={'post-photo-grid photos-'+Math.min(visiveis.length,4)}>{visiveis.map((url,i)=><button key={url} className="post-photo-tile" type="button" onClick={()=>setIndice(i)} aria-label={'Abrir foto '+(i+1)+' de '+fotos.length}><img src={urlDaApi(url)} alt={(post.titulo||'Foto da viagem')+' — foto '+(i+1)} loading="lazy"/>{!detail&&i===3&&fotos.length>4&&<span className="post-photo-more">+{fotos.length-4}</span>}</button>)}</div>
  {fotos.length>1&&<small className="post-gallery-count">{fotos.length} fotos · clique para ampliar</small>}
  {post.imagemFonteUrl&&<a className="post-image-credit" href={post.imagemFonteUrl} target="_blank" rel="noreferrer">{new URL(post.imagemFonteUrl, window.location.origin).hostname.endsWith('pinterest.com') ? 'Pinterest · ver pin de origem' : 'Fonte da imagem · imagem ilustrativa'}</a>}
  <dialog ref={dialog} className="post-photo-dialog" aria-label="Fotos da publicação" onClose={()=>setIndice(null)} onClick={e=>{if(e.target===e.currentTarget)setIndice(null);}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();mudar(1);}if(e.key==='ArrowLeft'){e.preventDefault();mudar(-1);}}}>
   <div className="post-photo-viewer"><button className="post-photo-close" onClick={()=>setIndice(null)} aria-label="Fechar fotos">×</button>{indice!==null&&<img src={urlDaApi(fotos[indice])} alt={'Foto '+(indice+1)+' de '+fotos.length+': '+(post.titulo||'Viagem')}/>}{fotos.length>1&&<><button className="post-photo-prev" aria-label="Foto anterior" onClick={()=>mudar(-1)}>‹</button><button className="post-photo-next" aria-label="Próxima foto" onClick={()=>mudar(1)}>›</button><span className="post-photo-position">{(indice??0)+1} / {fotos.length}</span></>}</div>
  </dialog>
 </div>;
}
