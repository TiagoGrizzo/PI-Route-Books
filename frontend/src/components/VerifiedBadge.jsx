export default function VerifiedBadge({ pessoa, comunidade }) {
 if (!pessoa?.perfilOficial && !comunidade?.verificada) return null;
 const label = comunidade ? "Comunidade verificada" : "Perfil oficial verificado do Route Books";
 return <span className="official-verified" role="img" aria-label={label} title={label}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 1 3 2 3.6.4 1.1 3.4L22 9.6l-.8 3.5.8 3.5-2.3 2.8-1.1 3.4-3.6.4-3 2-3-2-3.6-.4-1.1-3.4L2 16.6l.8-3.5L2 9.6l2.3-2.8 1.1-3.4L9 3Z" transform="translate(1 0) scale(.92)"/><path d="m7.5 12 3 3 6-6" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>;
}
