import { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import FeedLayout from '../components/FeedLayout.jsx';
import { getEstatisticasDestinos } from '../api/Route-book.jsx';

function normalizarChaveDestino(raw) {
    if (!raw || typeof raw !== 'string') return '';

    let texto = raw
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

    // Padroniza abreviações comuns de país
    texto = texto
        .replace(/\b(eua|u\.s\.a\.|usa|united states)\b/g, 'estados unidos')
        .replace(/\b(uk|reino unido)\b/g, 'reino unido')
        .replace(/\s*,\s*/g, ', ');

    return texto;
}

function formatarNomeExibicao(raw, chaveNormalizada) {
    const limpo = (raw || '')
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ', ')
        .trim();

    if (chaveNormalizada.includes('estados unidos') && limpo.toLowerCase().includes('orlando')) {
        return 'Orlando, Estados Unidos';
    }

    if (!limpo) return 'Destino sem nome';

    // Se estiver tudo em minúsculo ou tudo em maiúsculo, capitaliza palavras
    if (limpo === limpo.toLowerCase() || limpo === limpo.toUpperCase()) {
        return limpo
            .split(' ')
            .map(palavra => {
                const lower = palavra.toLowerCase();
                if (['de', 'da', 'do', 'das', 'dos', 'e'].includes(lower)) return lower;
                return lower.charAt(0).toUpperCase() + lower.slice(1);
            })
            .join(' ');
    }

    return limpo;
}

function consolidarDestinos(listaBruta) {
    if (!Array.isArray(listaBruta)) return [];

    const mapa = new Map();

    for (const item of listaBruta) {
        const destinoOriginal = item?.destino ?? item?.localizacao ?? item?.Localizacao ?? '';
        const chave = normalizarChaveDestino(destinoOriginal);
        if (!chave) continue;

        const curtidas = Number(item?.totalCurtidas ?? item?.curtidas ?? 0) || 0;
        const relatos = Number(item?.totalRelatos ?? item?.quantidadePosts ?? 1) || 1;
        const avaliacaoRaw = item?.mediaAvaliacao ?? item?.avaliacaoLugar ?? item?.AvaliacaoLugar ?? null;
        const avaliacaoNum = avaliacaoRaw !== null && avaliacaoRaw !== undefined && Number(avaliacaoRaw) > 0
            ? Number(avaliacaoRaw)
            : null;

        if (!mapa.has(chave)) {
            mapa.set(chave, {
                destino: formatarNomeExibicao(destinoOriginal, chave),
                totalCurtidas: 0,
                totalRelatos: 0,
                somaAvaliacoes: 0,
                qtdAvaliados: 0
            });
        }

        const atual = mapa.get(chave);
        atual.totalCurtidas += curtidas;
        atual.totalRelatos += relatos;

        if (avaliacaoNum !== null) {
            atual.somaAvaliacoes += avaliacaoNum;
            atual.qtdAvaliados += 1;
        }
    }

    return Array.from(mapa.values())
        .map(d => ({
            destino: d.destino,
            totalCurtidas: d.totalCurtidas,
            totalRelatos: d.totalRelatos,
            mediaAvaliacao: d.qtdAvaliados > 0
                ? Number((d.somaAvaliacoes / d.qtdAvaliados).toFixed(1))
                : 0
        }))
        .sort((a, b) => b.totalCurtidas - a.totalCurtidas || b.mediaAvaliacao - a.mediaAvaliacao);
}

function formatarCurtida(valor) {
    const num = Math.round(Number(valor) || 0);
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return `${num}`;
}

export default function DestinosEmAlta() {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const chartContainerRef = useRef(null);

    useEffect(() => {
        let ativo = true;
        setLoading(true);
        setErro('');

        getEstatisticasDestinos()
            .then(res => {
                if (!ativo) return;
                const consolidados = consolidarDestinos(res.data);
                setDados(consolidados);
            })
            .catch(() => {
                if (ativo) setErro('Não foi possível carregar os destinos em alta da comunidade.');
            })
            .finally(() => {
                if (ativo) setLoading(false);
            });

        return () => { ativo = false; };
    }, []);

    useEffect(() => {
        if (!dados.length || !chartContainerRef.current) return;

        const dadosGrafico = dados.slice(0, 5);
        const categorias = dadosGrafico.map(d => d.destino);
        const serieCurtidas = dadosGrafico.map(d => Number(d.totalCurtidas) || 0);
        const serieAvaliacao = dadosGrafico.map(d => Number(d.mediaAvaliacao) || 0);
        const maiorCurtida = Math.max(...serieCurtidas, 1);
        const passo = maiorCurtida <= 10 ? 1 : Math.ceil((maiorCurtida * 1.15) / 5);
        const tetoCurtidas = maiorCurtida <= 10 ? maiorCurtida + 1 : passo * 5;

        const options = {
            series: [
                { name: 'Curtidas', data: serieCurtidas },
                { name: 'Média Geral (★)', data: serieAvaliacao }
            ],
            chart: {
                type: 'bar',
                height: 380,
                background: 'transparent',
                toolbar: { show: false },
                fontFamily: 'inherit'
            },
            theme: { mode: 'dark' },
            colors: ['#10b981', '#fbbf24'],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '46%',
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
                formatter: (val, opts) => {
                    const num = Number(val) || 0;
                    if (num <= 0) return '';
                    return opts?.seriesIndex === 1 ? `${num.toFixed(1)} ★` : formatarCurtida(num);
                }
            },
            stroke: {
                show: true,
                width: 3,
                colors: ['transparent']
            },
            xaxis: {
                categories: categorias,
                labels: {
                    trim: false,
                    rotate: -25,
                    rotateAlways: categorias.length > 4,
                    hideOverlappingLabels: false,
                    maxHeight: 95,
                    style: {
                        colors: '#cbd5e1',
                        fontSize: '12px'
                    }
                },
                axisBorder: { color: 'rgba(255,255,255,0.12)' },
                axisTicks: { color: 'rgba(255,255,255,0.12)' }
            },
            yaxis: [
                {
                    min: 0,
                    max: tetoCurtidas,
                    tickAmount: maiorCurtida <= 10 ? Math.min(tetoCurtidas, 6) : 5,
                    title: {
                        text: 'Total de Curtidas',
                        style: { color: '#10b981', fontWeight: 600 }
                    },
                    labels: {
                        style: { colors: '#cbd5e1' },
                        formatter: val => formatarCurtida(val)
                    }
                },
                {
                    opposite: true,
                    min: 0,
                    max: 5,
                    tickAmount: 5,
                    title: {
                        text: 'Avaliação Média (0 a 5)',
                        style: { color: '#fbbf24', fontWeight: 600 }
                    },
                    labels: {
                        style: { colors: '#fbbf24' },
                        formatter: val => `${(Number(val) || 0).toFixed(1)} ★`
                    }
                }
            ],
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
                y: {
                    formatter: (val, opts) => {
                        const idx = opts?.dataPointIndex ?? 0;
                        const relatos = dadosGrafico[idx]?.totalRelatos ?? 0;
                        const num = Number(val) || 0;
                        if (opts?.seriesIndex === 0) {
                            return `${Math.round(num)} curtida(s) em ${relatos} relato(s)`;
                        }
                        return num > 0 ? `${num.toFixed(1)} / 5.0 estrelas (média geral)` : 'Sem avaliação registrada';
                    }
                }
            }
        };

        const chart = new ApexCharts(chartContainerRef.current, options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }, [dados]);

    return (
        <FeedLayout>
            <header className="profile-page-heading">
                <div>
                    <h1>Destinos em Alta na Comunidade</h1>
                    <span>Locais mais curtidos e bem avaliados pelos viajantes</span>
                </div>
            </header>

            {loading ? (
                <div className="feed-state-card">Carregando ranking dos destinos...</div>
            ) : erro ? (
                <div className="feed-state-card" role="alert">{erro}</div>
            ) : !dados.length ? (
                <div className="feed-state-card">
                    Ainda não há destinos ativos com localização suficiente para gerar o gráfico.
                </div>
            ) : (
                <section
                    style={{
                        backgroundColor: '#132a22',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: '16px',
                        padding: '20px',
                        marginTop: '12px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    <div style={{ marginBottom: '12px' }}>
                        <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>
                            Locais no hype
                        </h2>
                    </div>

                    <div ref={chartContainerRef} style={{ width: '100%', minHeight: '380px' }} />
                </section>
            )}
        </FeedLayout>
    );
}