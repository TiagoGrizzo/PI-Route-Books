import { useEffect, useState } from 'react';
export default function ProfilePhotoInput({ label, file, current, onChange }) {
 const [preview,setPreview]=useState('');
 const [error,setError]=useState('');
 useEffect(()=>{if(!file){setPreview('');return;}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url);},[file]);
 return <label>{label}{(preview||current)&&<img className="profile-upload-preview" src={preview||current} alt={'Prévia: '+label}/>}<input type="file" aria-label={label} accept="image/jpeg,image/png,image/webp" onChange={e=>{const next=e.target.files?.[0];setError('');if(next&&(!['image/jpeg','image/png','image/webp'].includes(next.type)||next.size>5*1024*1024)){setError('Escolha JPG, PNG ou WEBP de até 5 MB.');e.target.value='';onChange(undefined);return;}onChange(next);}}/>{error&&<small role="alert">{error}</small>}</label>;
}
