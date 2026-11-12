const CARD = 76, GAP = 8, STEP = CARD + GAP;

/**
 * Linha do tempo de acordes: os cartões deslizam continuamente para a esquerda
 * conforme a música toca. O acorde ativo ganha borda laranja, brilho e uma barra de progresso.
 */
export default function ChordTimeline({ bars, t, index, playing, onSeek }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-card py-3" role="list" aria-label="Linha do tempo de acordes">
      <div className="flex" style={{
        gap: GAP,
        transform: `translateX(${12 - t * STEP}px)`,
        transition: playing ? 'none' : 'transform .35s ease',
        willChange: 'transform',
      }}>
        {bars.map((b, i) => {
          const on = i === index;
          const past = i < index;
          return (
            <button key={i} role="listitem" aria-current={on ? 'true' : undefined} onClick={() => onSeek(i)}
              style={{ width: CARD }}
              className={`relative shrink-0 overflow-hidden rounded-xl border-2 px-2 pb-3 pt-2 text-center transition-colors ${
                on ? 'glow border-brand bg-brand/15' : past ? 'border-line text-slate-600' : 'border-line bg-ink text-slate-300'
              }`}>
              <div className="h-3 text-[10px] uppercase tracking-wide text-slate-500">{b.first ? b.name : ''}</div>
              <div className={`text-2xl font-bold ${on ? 'text-brand' : ''}`}>{b.c}</div>
              {on && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-line">
                  <div className="h-full bg-brand" style={{ width: `${(t - i) * 100}%` }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card" />
    </div>
  );
}
