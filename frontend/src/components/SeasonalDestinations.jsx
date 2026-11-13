import { useEffect, useState } from 'react';
import { getTemporadas } from '../api/Route-book.jsx';
import euaHalloween from '../assets/imgs/temporadas/eua-halloween-minimal.webp';
import portugalOutono from '../assets/imgs/temporadas/portugal-outono-minimal.webp';
import japaoKoyo from '../assets/imgs/temporadas/japao-koyo-minimal.webp';
import argentinaPrimavera from '../assets/imgs/temporadas/argentina-primavera-minimal.webp';

const artesOutubro = [
  { pais: 'Estados Unidos', imagem: euaHalloween, alt: 'Castelo e abóbora iluminada no Halloween de Orlando' },
  { pais: 'Portugal', imagem: portugalOutono, alt: 'Bonde amarelo de Lisboa sob a luz suave do outono' },
  { pais: 'Japão', imagem: japaoKoyo, alt: 'Portal japonês cercado por folhas vermelhas de outono' },
  { pais: 'Argentina', imagem: argentinaPrimavera, alt: 'Obelisco de Buenos Aires e jacarandás floridos na primavera' },
];

function DestinationArtwork({ destino, mes }) {
  const [falhou, setFalhou] = useState(false);
  const arte = mes === 10 ? artesOutubro.find(a => destino.pais.startsWith(a.pais)) : null;
  return arte && !falhou
    ? <img className="seasonal-destination-artwork" src={arte.imagem} alt={arte.alt} width="60" height="60" loading="lazy" decoding="async" onError={() => setFalhou(true)} />
    : <span className="feed-destination-icon"><i className={'fa ' + destino.icone} aria-hidden="true" /></span>;
}

export default function SeasonalDestinations() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  useEffect(() => {
    let ativo = true;
    const carregar = () => getTemporadas().then(r => { if (ativo) { setDados(r.data); setErro(false); } }).catch(() => { if (ativo) setErro(true); });
    carregar();
    const timer = setInterval(carregar, 60000);
    return () => { ativo = false; clearInterval(timer); };
  }, [tentativa]);
  return <section className="feed-side-card feed-seasonal">
    <div className="feed-side-card-heading"><h2>PAÍSES EM TEMPORADA</h2><i className="fa fa-calendar" aria-hidden="true" /></div>
    {dados && <p className="season-month">{new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, dados.mes - 1, 1)))}</p>}
    {erro ? <p className="feed-side-empty" role="alert">Não foi possível carregar as temporadas. <button type="button" onClick={() => setTentativa(n => n + 1)}>Tentar novamente</button></p> : !dados ? <p className="feed-side-empty">Carregando destinos...</p> : dados.destinos.length ? dados.destinos.map(d => <div className="feed-destination" key={d.id}><DestinationArtwork destino={d} mes={dados.mes} /><div><strong>{d.pais}</strong><small>{d.descricao}</small></div></div>) : <p className="feed-side-empty">Nenhum destino cadastrado para este período.</p>}
  </section>;
}
