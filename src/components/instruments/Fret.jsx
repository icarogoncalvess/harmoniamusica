import { BRAND } from '../../theme';

const SPACING = 26, PAD = 24, ROWS = 5, ROW_H = 28, TOP = 32;

/**
 * Braço do instrumento em formato de diagrama de acorde.
 * - frets: casa de cada corda (-1 abafada, 0 solta, n pressionada)
 * - fingers: dedo (1 a 4) de cada corda; opcional
 * - labels: nome das cordas; opcional
 * - left: espelha o diagrama (modo canhoto)
 * - compact: versão pequena, sem textos
 * Os pontos são animados ao trocar de acorde.
 */
export default function Fret({ frets, fingers = [], labels = [], left = false, compact = false, maxWidth = 190 }) {
  const n = frets.length;
  const w = (n - 1) * SPACING + PAD * 2;
  const h = TOP + ROWS * ROW_H + (compact ? 8 : 22);
  const pressed = frets.filter((f) => f > 0);
  const max = Math.max(0, ...pressed);
  const min = pressed.length ? Math.min(...pressed) : 1;
  const base = max > 5 ? min : 1;
  const x = (i) => PAD + (left ? n - 1 - i : i) * SPACING;
  const summary = frets.map((f, i) => `corda ${i + 1}: ${f < 0 ? 'abafada' : f === 0 ? 'solta' : `casa ${f}`}`).join(', ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', maxWidth }} className="mx-auto" role="img" aria-label={`Diagrama do acorde. ${summary}`}>
      {frets.map((_, i) => (
        <line key={`s${i}`} x1={x(i)} x2={x(i)} y1={TOP} y2={TOP + ROWS * ROW_H} stroke="#5B6672" strokeWidth="1.5" />
      ))}
      {[...Array(ROWS + 1)].map((_, r) => {
        const nut = r === 0 && base === 1;
        return (
          <line key={`r${r}`} x1={PAD} x2={w - PAD} y1={TOP + r * ROW_H} y2={TOP + r * ROW_H}
            stroke={nut ? '#E5E7EB' : '#3A444E'} strokeWidth={nut ? 5 : 1.5} />
        );
      })}

      {/* Corda solta (o) ou abafada (x) */}
      {frets.map((f, i) => {
        if (f === 0) return <circle key={`m${i}`} cx={x(i)} cy="18" r="5" fill="none" stroke="#E5E7EB" strokeWidth="1.5" />;
        if (f < 0) return <text key={`m${i}`} x={x(i)} y="23" textAnchor="middle" fontSize="14" fill="#8A95A0">×</text>;
        return null;
      })}

      {/* Dedos: um ponto por corda, que desliza de uma posição para outra */}
      {frets.map((f, i) => {
        const on = f > 0;
        const y = on ? TOP + (f - base + 0.5) * ROW_H : TOP - 12;
        return (
          <g key={`d${i}`} style={{
            transform: `translate(${x(i)}px, ${y}px)`,
            opacity: on ? 1 : 0,
            transition: 'transform .28s cubic-bezier(.3,1.4,.5,1), opacity .18s',
          }}>
            <circle r="10.5" fill={BRAND} />
            {!compact && fingers[i] > 0 && (
              <text y="4.5" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0B0D10">{fingers[i]}</text>
            )}
          </g>
        );
      })}

      {base > 1 && (
        <text x={left ? w - 3 : 3} y={TOP + ROW_H * 0.62} fontSize="11" fill="#8A95A0" textAnchor={left ? 'end' : 'start'}>{base}ª</text>
      )}
      {!compact && labels.map((l, i) => (
        <text key={`l${i}`} x={x(i)} y={h - 5} textAnchor="middle" fontSize="9" fill="#8A95A0">{l}</text>
      ))}
    </svg>
  );
}
