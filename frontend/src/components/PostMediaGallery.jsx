import { useEffect, useRef, useState } from 'react';
import { urlDaApi } from './postUtils.js';

export function fotosDoPost(post) {
  let fotos = post.imagens;
  if (!Array.isArray(fotos) && post.imagensJson) {
    try { fotos = JSON.parse(post.imagensJson); } catch { fotos = []; }
  }
  return [...new Set((Array.isArray(fotos) && fotos.length ? fotos : [post.imagemUrl]).filter(url => typeof url === 'string' && url.trim()))];
}

const navBtnBase = {
  position: 'fixed',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '42px',
  height: '42px',
  borderRadius: '999px',
  border: '1px solid rgba(255, 255, 255, 0.22)',
  backgroundColor: 'rgba(10, 26, 19, 0.88)',
  color: '#edf4eb',
  fontSize: '22px',
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 2147483647
};

export default function PostMediaGallery({ post, detail = false }) {
  const fotos = fotosDoPost(post);
  const [indice, setIndice] = useState(null);
  const dialog = useRef(null);

  useEffect(() => {
    if (indice !== null) {
      if (!dialog.current?.open) dialog.current?.showModal();
    } else if (dialog.current?.open) {
      dialog.current?.close();
    }
  }, [indice]);

  const mudar = delta => setIndice(i => {
    if (i === null || !fotos.length) return i;
    return (i + delta + fotos.length) % fotos.length;
  });

  if (!fotos.length) return null;

  if (post.tipoMidia === 'video') {
    return (
      <div className={'post-video' + (detail ? ' detail-video' : '')}>
        <video src={urlDaApi(post.imagemUrl)} controls preload="metadata" aria-label={'Vídeo de ' + post.titulo} />
      </div>
    );
  }

  const visiveis = detail ? fotos : fotos.slice(0, 4);

  return (
    <div className={'post-gallery' + (detail ? ' post-gallery-detail' : '') + (post.imagemFonteUrl ? ' post-gallery-credit' : '')}>
      <div className={'post-photo-grid photos-' + Math.min(visiveis.length, 4)}>
        {visiveis.map((url, i) => (
          <button
            key={url}
            className="post-photo-tile"
            type="button"
            onClick={() => setIndice(i)}
            aria-label={'Abrir foto ' + (i + 1) + ' de ' + fotos.length}
          >
            <img src={urlDaApi(url)} alt={(post.titulo || 'Foto da viagem') + ' — foto ' + (i + 1)} loading="lazy" />
            {!detail && i === 3 && fotos.length > 4 && <span className="post-photo-more">+{fotos.length - 4}</span>}
          </button>
        ))}
      </div>

      {fotos.length > 1 && <small className="post-gallery-count">{fotos.length} fotos · clique para ampliar</small>}

      {post.imagemFonteUrl && (
        <a className="post-image-credit" href={post.imagemFonteUrl} target="_blank" rel="noreferrer">
          {new URL(post.imagemFonteUrl, window.location.origin).hostname.endsWith('pinterest.com') ? 'Pinterest · ver pin de origem' : 'Fonte da imagem · imagem ilustrativa'}
        </a>
      )}

      <dialog
        ref={dialog}
        className="post-photo-dialog"
        aria-label="Fotos da publicação"
        onClose={() => setIndice(null)}
        onClick={e => { if (e.target === e.currentTarget) setIndice(null); }}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') { e.preventDefault(); mudar(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); mudar(-1); }
        }}
        style={{
          padding: 0,
          border: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          maxWidth: '100vw',
          maxHeight: '100vh',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <div
          className="post-photo-viewer"
          onClick={e => { if (e.target === e.currentTarget) setIndice(null); }}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <button
            type="button"
            className="post-photo-close"
            onClick={() => setIndice(null)}
            aria-label="Fechar fotos"
            style={{
              position: 'fixed',
              top: '18px',
              right: '18px',
              width: '38px',
              height: '38px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              backgroundColor: 'rgba(10, 26, 19, 0.92)',
              color: '#edf4eb',
              fontSize: '22px',
              lineHeight: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2147483647
            }}
          >
            ×
          </button>

          {indice !== null && (
            <img
              src={urlDaApi(fotos[indice])}
              alt={'Foto ' + (indice + 1) + ' de ' + fotos.length + ': ' + (post.titulo || 'Viagem')}
              style={{
                maxWidth: 'calc(100vw - 130px)',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
              }}
            />
          )}

          {fotos.length > 1 && (
            <>
              <button
                type="button"
                className="post-photo-prev"
                aria-label="Foto anterior"
                onClick={() => mudar(-1)}
                style={{ ...navBtnBase, left: '18px' }}
              >
                ‹
              </button>
              <button
                type="button"
                className="post-photo-next"
                aria-label="Próxima foto"
                onClick={() => mudar(1)}
                style={{ ...navBtnBase, right: '18px' }}
              >
                ›
              </button>
              <span
                className="post-photo-position"
                style={{
                  position: 'fixed',
                  bottom: '18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(10, 26, 19, 0.92)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  color: '#edf4eb',
                  fontSize: '12.5px',
                  zIndex: 2147483647
                }}
              >
                {(indice ?? 0) + 1} / {fotos.length}
              </span>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}