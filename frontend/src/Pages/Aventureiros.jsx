import VerifiedBadge from '../components/VerifiedBadge.jsx';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAventureiros } from '../api/Route-book.jsx';
import FeedLayout from '../components/FeedLayout.jsx';
import { Avatar } from '../components/PostCard.jsx';
import '../assets/css/aventureiros.css';

export default function Aventureiros() {
    const [pessoas, setPessoas] = useState([]), [loading, setLoading] = useState(true), [erro, setErro] = useState(''), [tentativa, setTentativa] = useState(0);
    const uid = Number(localStorage.getItem('UsuarioId')) || null;
    useEffect(() => {
        let ativo = true; setLoading(true); setErro('');
        getAventureiros().then(r => { if (ativo) setPessoas(r.data.filter(p => p.idUsuario !== uid)); }).catch(() => { if (ativo) setErro('Não foi possível carregar os aventureiros.'); }).finally(() => { if (ativo) setLoading(false); });
        return () => { ativo = false; };
    }, [uid, tentativa]);
    return <FeedLayout><section className="adventurers-page" aria-labelledby="adventurers-title">
        <header className="adventurers-heading"><i className="fa fa-users" aria-hidden="true" /><div><h1 id="adventurers-title">Aventureiros para seguir</h1><p>Inicie um chat privado com qualquer membro da comunidade Route Books</p></div></header>
        {loading ? <div className="adventurers-grid" aria-busy="true" aria-label="Carregando aventureiros">{[0, 1, 2, 3, 4].map(i => <div key={i} className={'adventurer-skeleton' + (!i ? ' adventurer-featured' : '')} />)}</div> : erro ? <div className="feed-state-card" role="alert"><p>{erro}</p><button className="social-green-button" onClick={() => setTentativa(n => n + 1)}>Tentar novamente</button></div> : pessoas.length ? <div className="adventurers-grid">{pessoas.map((p, i) => {
            const chat = '/chat?idDoAmigo=' + p.idUsuario;
            const local = [p.cidade, p.uf, p.pais].filter(Boolean).join(', ');
            return <article key={p.idUsuario} className={'adventurer-card' + (!i ? ' adventurer-featured' : '')}>
                <Link to={'/perfil/' + p.idUsuario} className="adventurer-avatar" aria-label={'Ver perfil de ' + (p.nomeCompleto || p.username)}><Avatar pessoa={p} /></Link>
                <div className="adventurer-copy"><h2><Link to={'/perfil/' + p.idUsuario}>{p.nomeCompleto || p.username}<VerifiedBadge pessoa={p} />{!i && p.username && <span> (@{p.username})</span>}</Link></h2>
                    {!i && p.biografia && <p className="adventurer-bio">{p.biografia}</p>}
                    {local && <p className="adventurer-location"><i className="fa fa-map-marker" aria-hidden="true" /> {local}</p>}
                    {!!i && <p className="adventurer-bio">{p.biografia || 'Aventureiro Route Books'}</p>}
                </div>
                <Link className="adventurer-chat" aria-label={'Conversar com ' + (p.nomeCompleto || p.username)} to={uid ? chat : '/login?voltar=' + encodeURIComponent(chat)}><i className="fa fa-paper-plane" aria-hidden="true" /><span>Conversar</span></Link>
            </article>;
        })}</div> : <div className="feed-state-card">Novos aventureiros aparecerão aqui quando entrarem na comunidade.</div>}
    </section></FeedLayout>;
}
