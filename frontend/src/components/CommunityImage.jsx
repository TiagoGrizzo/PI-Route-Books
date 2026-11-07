import artwork from '../assets/imgs/comunidades.jpg';

const frames = {
  'orlando-com-a-fran': [76, 600, 435, 422],
  'mochileiros-do-mundo': [76, 81, 435, 435],
  'amantes-da-natureza': [583, 81, 435, 435],
  'gastronomia-pelo-mundo': [1089, 81, 435, 435],
  'parques-e-magia': [76, 600, 435, 422],
  'viagens-de-aventura': [583, 600, 435, 422],
  'dicas-e-economia': [1089, 600, 435, 422],
};

export default function CommunityImage({ comunidade, large = false }) {
  const frame = frames[comunidade.slug];
  if (!frame) return <span className="feed-community-icon">{comunidade.icone}</span>;
  return (
    <svg
      className={'feed-community-artwork' + (large ? ' feed-community-artwork-large' : '')}
      viewBox={frame.join(' ')}
      role="img"
      aria-label={comunidade.nome}
      focusable="false"
    >
      <image href={artwork} width="1600" height="1600" />
    </svg>
  );
}