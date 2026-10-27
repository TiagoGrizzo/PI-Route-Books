import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsuarios, getNaoLidas } from '../api/Route-book.jsx';
import '../assets/css/aventureiros.css';

export default function Aventureiros() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [naoLidas, setNaoLidas] = useState({});

  useEffect(() => {
    let ativo = true;

    getUsuarios()
      .then((res) => {
        if (!ativo) return;
        const lista = Array.isArray(res.data) ? res.data : [];
        setUsuarios(lista);
      })
      .catch(() => {
        if (!ativo) return;
        setErro('Não foi possível carregar a lista de aventureiros.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    if (usuarios.length === 0) return;

    let ativo = true;
    const carregarBadges = async () => {
      const mapa = {};
      for (const u of usuarios) {
        try {
          const res = await getNaoLidas(u.idUsuario);
          mapa[u.idUsuario] = res.data?.qtd || 0;
        } catch {
          mapa[u.idUsuario] = 0;
        }
      }
      if (ativo) setNaoLidas(mapa);
    };

    carregarBadges();

    return () => { ativo = false; };
  }, [usuarios]);

  return (
    <section className="container-xxl mt-5 flex-grow-1 aventureiros-page">
      <div className="d-flex align-items-center mb-4">
        <i className="fa fa-users me-3" style={{ fontSize: '2rem', color: '#27ae60' }}></i>
        <div>
          <h3 className="titulo-font mb-0">Encontre outros Aventureiros</h3>
          <small className="text-muted">Inicie um chat privado com qualquer membro da comunidade Route Books</small>
        </div>
      </div>

      <hr className="mb-4" style={{ opacity: 0.1 }} />

      {loading ? (
        <p className="text-center text-muted">Carregando aventureiros...</p>
      ) : erro ? (
        <p className="text-center text-muted">{erro}</p>
      ) : usuarios.length > 0 ? (
        <div className="row">
          {usuarios.map((u) => (
            <div className="col-md-4 mb-4" key={u.idUsuario}>
              <div className="card shadow-sm border-0 card-aventureiro">
                <div className="card-body d-flex align-items-center justify-content-between p-3">
                  <div className="d-flex align-items-center">
                    <i className="fa fa-user-circle text-secondary me-3" style={{ fontSize: '2.8rem', opacity: 0.7 }}></i>
                    <div>
                      <h6 className="mb-1 titulo-font" style={{ fontWeight: 600, color: '#2c3e50' }}>
                        {u.nomeCompleto || u.username}
                      </h6>
                      <small className="text-muted d-block">
                        <i className="fa fa-map-marker me-1" style={{ color: '#e74c3c' }}></i>
                        {u.cidade} - {u.uf}
                      </small>
                    </div>
                  </div>
                  <div className="position-relative d-inline-block">
                    <Link to={`/chat?idDoAmigo=${u.idUsuario}`} className="btn btn-success btn-conversar text-white">
                      <i className="fa fa-paper-plane me-1"></i> Conversar
                    </Link>
                    {naoLidas[u.idUsuario] > 0 && (
                      <span className="notificacao-chat">{naoLidas[u.idUsuario]}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-12 text-center text-muted py-5">
          <i className="fa fa-user-times d-block mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
          Não há outros usuários cadastrados no momento.
        </div>
      )}
    </section>
  );
}
