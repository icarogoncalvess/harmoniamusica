import { BRAND } from '../../theme';

// Passos acima do Dó central (C4). A linha inferior da pauta é Mi4 (passo 2).
const STEP = { C4: 0, D4: 1, E4: 2, F4: 3, G4: 4, A4: 5, B4: 6, C5: 7 };
const BAR_W = 92, LEFT = 24;

/**
 * Pauta sincronizada: mostra 4 compassos por vez, a cabeça de leitura acompanha
 * o tempo (progress de 0 a 1 dentro do compasso atual) e as notas já tocadas esmaecem.
 */
export default function Staff({ bars, current, progress = 0 }) {
  const start = Math.floor(current / 4) * 4;
  const visible = bars.slice(start, start + 4);
  const headX = LEFT + (current - start + progress) * BAR_W;

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-card p-3">
      <svg viewBox="0 0 400 110" style={{ minWidth: 360 }} className="w-full" role="img" aria-label="Partitura simulada">
        {[30, 40, 50, 60, 70].map((y) => (
          <line key={y} x1="8" x2="392" y1={y} y2={y} stroke="#5B6672" />
        ))}
        <line x1={LEFT} x2={LEFT} y1="30" y2="70" stroke="#5B6672" />
        {visible.map((bar, i) => {
          const idx = start + i;
          const on = idx === current;
          const past = idx < current;
          const left = LEFT + i * BAR_W;
          const x = left + BAR_W / 2;
          const step = STEP[bar.n] ?? 0;
          const y = 80 - step * 5;
          const color = on ? BRAND : '#E5E7EB';
          return (
            <g key={idx} opacity={past ? 0.4 : 1}>
              {on && <rect x={left} y="22" width={BAR_W} height="56" fill={BRAND} opacity=".12" />}
              <line x1={left + BAR_W} x2={left + BAR_W} y1="30" y2="70" stroke="#5B6672" />
              {step === 0 && <line x1={x - 9} x2={x + 9} y1="80" y2="80" stroke="#8A95A0" />}
              <ellipse cx={x} cy={y} rx="6" ry="4.5" fill={color} />
              <line x1={x + 5.5} x2={x + 5.5} y1={y} y2={y - 28} stroke={color} strokeWidth="1.5" />
              <text x={x} y="100" textAnchor="middle" fontSize="12" fontWeight={on ? 700 : 400} fill={on ? BRAND : '#8A95A0'}>{bar.c}</text>
            </g>
          );
        })}
        <line x1={headX} x2={headX} y1="20" y2="80" stroke={BRAND} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="mt-1 text-xs text-slate-500">Partitura simulada em clave de Sol, sincronizada com o player.</p>
    </div>
  );
}
