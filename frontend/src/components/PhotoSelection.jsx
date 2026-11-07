import { useEffect, useState } from 'react';
export function validarMidias(files){
 if(files.length>10)return 'Escolha até 10 fotos por publicação.';
 for(const f of files){const video=f.type.startsWith('video/');if(!['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime'].includes(f.type))return 'Use JPG, PNG, WEBP, MP4, WEBM ou MOV.';if(video&&files.length>1)return 'Escolha um vídeo ou um álbum de fotos por vez.';if(f.size>(video?20:5)*1024*1024)return 'Cada foto pode ter até 5 MB; o vídeo, até 20 MB.';}
 return '';
}
export default function PhotoSelection({files,onRemove}){
 const [urls,setUrls]=useState([]);
 useEffect(()=>{const next=files.map(f=>URL.createObjectURL(f));setUrls(next);return()=>next.forEach(u=>URL.revokeObjectURL(u));},[files]);
 return <div className="photo-selection">{files.map((f,i)=><div key={i} className="photo-selection-item">{f.type.startsWith('video/')?<video src={urls[i]} controls/>:<img src={urls[i]} alt={'Prévia da foto '+(i+1)}/>}<button type="button" aria-label={'Remover '+f.name} onClick={()=>onRemove(i)}>×</button><small>{f.name}</small></div>)}</div>;
}
