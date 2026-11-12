import { BRAND } from '../../theme';

const WHITE = [0, 2, 4, 5, 7, 9, 11];
const BLACK = [[0, 1], [1, 3], [3, 6], [4, 8], [5, 10]]; // [tecla branca à esquerda, classe de altura]

/** Uma oitava de teclado com as notas do acorde destacadas. */
export default function Piano({ pc }) {
  return (
    <svg viewBox="0 0 196 96" className="mx-auto w-full" style={{ maxWidth: 230 }}>
      {WHITE.map((p, i) => (
        <rect key={p} x={i * 28} y="2" width="27" height="90" rx="3" fill={pc.includes(p) ? BRAND : '#E5E7EB'} />
      ))}
      {BLACK.map(([i, p]) => (
        <rect key={p} x={(i + 1) * 28 - 9} y="2" width="18" height="55" rx="2"
          fill={pc.includes(p) ? '#FFB066' : '#14181D'} stroke="#0B0D10" />
      ))}
    </svg>
  );
}
