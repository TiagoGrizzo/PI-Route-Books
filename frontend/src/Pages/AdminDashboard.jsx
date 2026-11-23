import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import {
  getComunidadesAtivas,
  getMediaPostsPorCategoria,
  getPostsMensaisAtivos,
  getpostsPendentes,
  getUsuariosAtivos,
} from '../api/Route-book.jsx';

const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function AdminDashboard() {
  const [resumo, setResumo] = useState({ usuarios: 0, comunidades: 0, postsPendentes: 0 });
  const [serieMensal, setSerieMensal] = useState(Array(12).fill(0));
  const [categoriasMedia, setCategoriasMedia] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      try {
        const [usuarios, comunidades, pendentes, mensal, medias] = await Promise.all([
          getUsuariosAtivos(),
          getComunidadesAtivas(),
          getpostsPendentes(),
          getPostsMensaisAtivos(),
          getMediaPostsPorCategoria(),
        ]);
        if (!ativo) return;
        setResumo({
          usuarios: usuarios.data,
          comunidades: comunidades.data,
          postsPendentes: Array.isArray(pendentes.data) ? pendentes.data.length : 0,
        });
        const pontos = Array(12).fill(0);
        (mensal.data.meses || []).forEach(({ mes, quantidade }) => {
          if (mes >= 1 && mes <= 12) pontos[mes - 1] = quantidade;
        });
        setSerieMensal(pontos);
        setAno(mensal.data.ano);
        setCategoriasMedia(medias.data.categorias || []);
      } catch {
        if (ativo) setErro('Não foi possível carregar os dados da dashboard. Verifique a sessão administrativa e a API.');
      } finally {
        if (ativo) setCarregando(false);
      }
    };
    carregar();

    return () => { ativo = false; };
  }, []);

  const opcoesGrafico = {
    chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'Roboto, Arial, sans-serif' },
    colors: ['#00875a'],
    dataLabels: { enabled: false },
    stroke: { curve: 'straight', width: 3 },
    markers: { size: 5, colors: ['#00875a'], strokeColors: '#fff', strokeWidth: 2, hover: { size: 7 } },
    xaxis: { categories: nomesMeses, title: { text: 'Mês' } },
    yaxis: { min: 0, forceNiceScale: true, title: { text: 'Posts ativos criados' }, labels: { formatter: valor => Math.round(valor) } },
    tooltip: { y: { formatter: valor => `${valor} ${valor === 1 ? 'post' : 'posts'}` } },
    grid: { borderColor: '#e1eae5' },
  };

  const opcoesCategorias = {
    chart: {
      type: 'bar', toolbar: { show: false }, fontFamily: 'Roboto, Arial, sans-serif',
      events: {
        dataPointSelection: (_event, _chart, config) => {
          if (!categoriaSelecionada && config.dataPointIndex >= 0)
            setCategoriaSelecionada(categoriasMedia[config.dataPointIndex]);
        },
      },
    },
    colors: ['#00875a'],
    plotOptions: { bar: { horizontal: false, columnWidth: '48%', borderRadius: 5 } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categoriaSelecionada
        ? categoriaSelecionada.meses.map(item => nomesMeses[item.mes - 1])
        : categoriasMedia.map(item => item.nome),
      title: { text: categoriaSelecionada ? 'Mês' : 'Categoria' },
    },
    yaxis: {
      min: 0, forceNiceScale: true,
      title: { text: categoriaSelecionada ? 'Posts ativos' : 'Média mensal de posts' },
      labels: { formatter: valor => Number.isInteger(valor) ? valor : valor.toFixed(1) },
    },
    tooltip: { y: { formatter: valor => `${valor} ${valor === 1 ? 'post' : 'posts'}` } },
    grid: { borderColor: '#e1eae5' },
  };
  const serieCategorias = categoriaSelecionada
    ? categoriaSelecionada.meses.map(item => item.quantidade)
    : categoriasMedia.map(item => item.mediaMensal);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div><span className="admin-eyebrow">VISÃO GERAL</span><h1>Dashboard</h1><p>Acompanhe a atividade da comunidade Route Books.</p></div>
      </div>

      {erro && <div role="alert" className="admin-alert error">{erro}</div>}

      <div className="admin-stat-grid">
        <article className="admin-stat-card"><span className="admin-stat-icon"><i className="fa fa-users" /></span><div><span>Usuários ativos</span><strong>{carregando ? '…' : resumo.usuarios}</strong></div></article>
        <article className="admin-stat-card"><span className="admin-stat-icon"><i className="fa fa-globe" /></span><div><span>Comunidades ativas</span><strong>{carregando ? '…' : resumo.comunidades}</strong></div></article>
        <article className="admin-stat-card"><span className="admin-stat-icon"><i className="fa fa-inbox" /></span><div><span>Posts pendentes</span><strong>{carregando ? '…' : resumo.postsPendentes}</strong></div></article>
      </div>

      <section className="admin-chart-card">
        <div className="admin-chart-heading"><div><span className="admin-eyebrow">PUBLICAÇÕES</span><h2>Posts ativos por mês</h2><p>Quantidade de posts ativos criados em cada mês de {ano}.</p></div></div>
        {carregando ? <div role="status" className="admin-chart-loading">Carregando gráfico…</div> : <Chart options={opcoesGrafico} series={[{ name: 'Posts ativos', data: serieMensal }]} type="line" height={330} />}
      </section>

      <section className="admin-chart-card">
        <div className="admin-chart-heading">
          <div>
            <span className="admin-eyebrow">CATEGORIAS</span>
            <h2>{categoriaSelecionada ? categoriaSelecionada.nome : 'Média mensal por categoria'}</h2>
            <p>{categoriaSelecionada
              ? `Posts ativos desta categoria em cada mês de ${ano}.`
              : `As três categorias mais usadas em ${ano}. Selecione uma coluna para ver os valores mensais.`}</p>
          </div>
          {categoriaSelecionada && <button type="button" className="admin-refresh" onClick={() => setCategoriaSelecionada(null)}>Voltar às categorias</button>}
        </div>
        {carregando ? <div role="status" className="admin-chart-loading">Carregando gráfico…</div>
          : categoriasMedia.length === 0 ? <div className="admin-empty"><h2>Sem dados de categoria</h2><p>Não há posts ativos categorizados neste ano.</p></div>
            : <Chart options={opcoesCategorias} series={[{ name: categoriaSelecionada ? 'Posts ativos' : 'Média mensal', data: serieCategorias }]} type="bar" height={330} />}
      </section>
    </section>
  );
}
