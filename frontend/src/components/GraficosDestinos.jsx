import { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import { getEstatisticasUsuario } from '../api/Route-book.jsx';

const LIMITE_POSTS = 3;

export default function GraficoDestinos({ usuarioId }) {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!usuarioId) return;
    let ativo = true;
    setLoading(true);
    setErro('');

    getEstatisticasUsuario(usuarioId)
      .then(res => {
        if (!ativo) return;
        const lista = Array.isArray(res.data) ? res.data : [];
        const comInteracao = lista.filter(
          d => (Number(d.curtidas) || 0) > 0 || (Number(d.comentarios) || 0) > 0
        );
        setDados(comInteracao.slice(0, LIMITE_POSTS));
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar as estatísticas deste perfil.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => { ativo = false; };
  }, [usuarioId]);

  useEffect(() => {
    if (!dados.length || !chartContainerRef.current) return;

    const itensExibidos = dados.slice(0, LIMITE_POSTS);
    const categorias = itensExibidos.map(d => d.rotulo);
    const serieCurtidas = itensExibidos.map(d => Number(d.curtidas) || 0);
    const serieComentarios = itensExibidos.map(d => Number(d.comentarios) || 0);
    const maiorValor = Math.max(...serieCurtidas, ...serieComentarios, 1);

    const options = {
      series: [
        { name: 'Curtidas', data: serieCurtidas },
        { name: 'Comentários', data: serieComentarios }
      ],
      chart: {
        type: 'bar',
        height: 330,
        background: 'transparent',
        toolbar: { show: false },
        fontFamily: 'inherit'
      },
      theme: { mode: 'dark' },
      colors: ['#10b981', '#38bdf8'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          borderRadius: 6,
          dataLabels: { position: 'top' }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#e2e8f0']
        },
        formatter: val => (val > 0 ? val : '')
      },
      stroke: {
        show: true,
        width: 3,
        colors: ['transparent']
      },
      xaxis: {
        categories: categorias,
        labels: {
          trim: true,
          maxHeight: 65,
          style: {
            colors: '#cbd5e1',
            fontSize: '12px'
          }
        },
        axisBorder: { color: 'rgba(255,255,255,0.12)' },
        axisTicks: { color: 'rgba(255,255,255,0.12)' }
      },
      yaxis: {
        min: 0,
        max: maiorValor + 1,
        tickAmount: Math.min(maiorValor + 1, 6),
        title: {
          text: 'Interações',
          style: { color: '#94a3b8', fontWeight: 600 }
        },
        labels: {
          style: { colors: '#cbd5e1' },
          formatter: val => Math.round(val)
        }
      },
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        strokeDashArray: 4,
        padding: { top: 20 }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: { colors: '#e2e8f0' }
      },
      tooltip: {
        theme: 'dark',
        x: {
          formatter: (_, opts) => {
            const item = itensExibidos[opts?.dataPointIndex ?? 0];
            return item ? `${item.titulo} (${item.rotulo})` : '';
          }
        },
        y: {
          formatter: (val, opts) =>
            opts?.seriesIndex === 0 ? `${val} curtida(s)` : `${val} comentário(s)`
        }
      }
    };

    const chart = new ApexCharts(chartContainerRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dados]);

  if (loading) {
    return <div className="feed-state-card">Carregando estatísticas do viajante...</div>;
  }

  if (erro) {
    return <div className="feed-state-card" role="alert">{erro}</div>;
  }

  if (!dados.length) {
    return (
      <div className="feed-state-card">
        Este perfil ainda não possui publicações com curtidas ou comentários para exibir estatísticas.
      </div>
    );
  }

  return (
    <section
      style={{
        backgroundColor: '#132a22',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '16px',
        padding: '20px',
        marginTop: '16px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>
          Engajamento das Publicações
        </h3>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
          Curtidas e comentários recebidos nos relatos com interações neste perfil.
        </p>
      </div>

      <div ref={chartContainerRef} style={{ width: '100%', minHeight: '330px' }} />
    </section>
  );
}