import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import ChordView from '../components/instruments/ChordView';
import InstPicker from '../components/instruments/InstPicker';
import ChordTimeline from '../components/player/ChordTimeline';
import Staff from '../components/score/Staff';
import { describeChord } from '../data/chords';

const SPEEDS = [0.5, 0.75, 1];
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function Toggle({ on, onClick, children }) {
  return (
    <button onClick={onClick} aria-pressed={on}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
        on ? 'border-brand bg-brand/15 text-brand' : 'border-line bg-card text-slate-300'
      }`}>
      {children}
    </button>
  );
}

function Equalizer({ active }) {
  return (
    <div className="flex h-6 items-end gap-0.5" aria-hidden="true">
      {[0, 0.2, 0.4, 0.1, 0.3].map((d, i) => (
        <span key={i} className="eq-bar h-full w-1 rounded-full bg-brand"
          style={{ animationDelay: `${d}s`, animationPlayState: active ? 'running' : 'paused' }} />
      ))}
    </div>
  );
}

export default function SongView({ song, instrument, setInstrument, left, setLeft }) {
  // Lista plana de compassos, com a seção a que cada um pertence.
  const bars = useMemo(
    () => song.sections.flatMap((s, si) => s.bars.map((b, i) => ({ ...b, name: s.name, si, first: i === 0 }))),
    [song]
  );

  const [mode, setMode] = useState('pratico'); // 'pratico' | 'partitura'
  const [t, setT] = useState(0);               // posição em compassos (decimal)
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [dictChord, setDictChord] = useState(null);

  const tRef = useRef(0);
  const seek = (v) => { tRef.current = v; setT(v); };

  const index = Math.min(Math.floor(t), bars.length - 1);
  const frac = Math.min(t - index, 1);
  const current = bars[index];
  const next = bars[index + 1]?.c;
  const shown = dictChord || current.c;
  const beat = Math.min(3, Math.floor(frac * 4));
  const hint = playing && !dictChord && next && next !== current.c && frac >= 0.5 ? `Prepare o ${next}!` : '';
  const uniqueChords = [...new Set(bars.map((b) => b.c))];
  const barSecs = (4 * 60) / song.bpm;

  // Valores lidos dentro do loop de animação (evita variáveis desatualizadas).
  const barSeconds = useRef(1);
  barSeconds.current = barSecs / speed;
  const loopRange = useRef(null);
  if (loop) {
    const first = bars.findIndex((b) => b.si === current.si);
    loopRange.current = [first, first + bars.filter((b) => b.si === current.si).length];
  } else {
    loopRange.current = null;
  }

  // Relógio do player: requestAnimationFrame com atualização a ~30 quadros por segundo.
  useEffect(() => {
    if (!playing) return undefined;
    let raf;
    let last = performance.now();
    let acc = 0;
    const tick = (now) => {
      acc += (now - last) / 1000;
      last = now;
      if (acc >= 1 / 30) {
        let n = tRef.current + acc / barSeconds.current;
        acc = 0;
        const range = loopRange.current;
        if (range && n >= range[1]) n = range[0];
        if (n >= bars.length) {
          seek(0);
          setPlaying(false);
          return;
        }
        seek(n);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, bars.length]);

  const togglePlay = () => { setDictChord(null); setPlaying((p) => !p); };

  // Barra de espaço toca/pausa (quando nenhum botão está em foco).
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Rolagem automática da lista de compassos.
  const listRef = useRef(null);
  const rowRefs = useRef([]);
  useEffect(() => {
    const box = listRef.current;
    const row = rowRefs.current[index];
    if (!autoScroll || !box || !row) return;
    box.scrollTo({ top: row.offsetTop - box.clientHeight / 2 + 30, behavior: 'smooth' });
  }, [index, autoScroll]);

  return (
    <div className="animate-rise space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 rounded-2xl shadow-lg"
          style={{ background: `linear-gradient(135deg, hsl(${song.hue} 90% 50%), #14181D)` }} />
        <div className="min-w-0 flex-1">
          <div className="text-xs text-brand">Importado do {song.src || 'catálogo'} · {song.level}</div>
          <h2 className="truncate text-xl font-bold">{song.title}</h2>
          <p className="text-sm text-slate-400">{song.artist} · Tom {song.key} · {song.bpm} bpm</p>
          <p className="text-xs tabular-nums text-slate-500">{fmt(t * barSecs)} / {fmt(bars.length * barSecs)}</p>
        </div>
        <Equalizer active={playing} />
      </div>

      {song.tip && (
        <p className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-2.5 text-sm text-amber-200">
          <span className="font-semibold">Dica para iniciantes:</span> {song.tip}
        </p>
      )}

      <div className="grid grid-cols-2 rounded-full border border-line bg-card p-1 text-sm">
        {[['pratico', 'Modo prático'], ['partitura', 'Modo partitura']].map(([key, label]) => (
          <button key={key} onClick={() => setMode(key)} aria-pressed={mode === key}
            className={`rounded-full py-2 font-medium transition ${mode === key ? 'bg-brand text-black' : 'text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      <InstPicker value={instrument} onChange={setInstrument} />

      <ChordTimeline bars={bars} t={t} index={index} playing={playing} onSeek={(i) => { setDictChord(null); seek(i); }} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div key={mode} className="animate-rise md:min-h-[22rem]">
            {mode === 'pratico' ? (
              <div className="rounded-2xl border border-line bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-500">{dictChord ? 'Dicionário de acordes' : playing ? 'Toque agora' : 'Acorde'}</div>
                    <div key={shown} className="animate-rise text-5xl font-bold text-brand">{shown}</div>
                    <div className="mt-2 flex gap-1.5" aria-hidden="true">
                      {[0, 1, 2, 3].map((b) => (
                        <span key={b} className={`h-2 w-6 rounded-full transition-colors ${playing && !dictChord && b <= beat ? 'bg-brand' : 'bg-line'}`} />
                      ))}
                    </div>
                    <div className="mt-2 h-5 text-sm font-medium text-amber-300" aria-live="polite">{hint}</div>
                  </div>
                  {next && !dictChord && (
                    <div className="w-24 text-center opacity-80">
                      <div className="text-xs text-slate-500">Próximo: {next}</div>
                      <ChordView chord={next} instrument={instrument} left={left} maxWidth={84} compact />
                    </div>
                  )}
                </div>
                <div className="mt-2"><ChordView chord={shown} instrument={instrument} left={left} maxWidth={200} /></div>
                <ul className="mt-3 space-y-0.5 text-xs text-slate-400">
                  {describeChord(instrument, shown).map((l) => <li key={l}>{l}</li>)}
                </ul>
              </div>
            ) : (
              <Staff bars={bars} current={index} progress={frac} />
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-line bg-card p-4">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} aria-label={playing ? 'Pausar' : 'Tocar'}
                className="grid h-12 w-12 place-items-center rounded-full bg-brand text-black active:scale-95">
                <Icon name={playing ? 'pause' : 'play'} />
              </button>
              <input type="range" min="0" max={bars.length} step="0.01" value={t} aria-label="Posição da música"
                onChange={(e) => seek(Math.min(+e.target.value, bars.length - 0.01))}
                className="flex-1 accent-brand" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Toggle on={loop} onClick={() => setLoop(!loop)}><Icon name="loop" size={14} /> Loop: {current.name}</Toggle>
              {SPEEDS.map((s) => <Toggle key={s} on={speed === s} onClick={() => setSpeed(s)}>{s}x</Toggle>)}
              <Toggle on={autoScroll} onClick={() => setAutoScroll(!autoScroll)}>Rolagem automática</Toggle>
              {instrument !== 'piano' && <Toggle on={left} onClick={() => setLeft(!left)}>Modo canhoto</Toggle>}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs text-slate-500">Dicionário de acordes: toque para ver o desenho</div>
            <div className="flex flex-wrap gap-2">
              {uniqueChords.map((c) => (
                <button key={c} onClick={() => { setPlaying(false); setDictChord(dictChord === c ? null : c); }}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${dictChord === c ? 'border-brand text-brand' : 'border-line bg-card'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={listRef} className="relative max-h-[30rem] space-y-1 overflow-y-auto rounded-2xl border border-line bg-card p-3">
          {bars.map((b, i) => {
            const on = i === index;
            return (
              <div key={i} ref={(el) => (rowRefs.current[i] = el)}>
                {b.first && <div className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{b.name}</div>}
                <button onClick={() => { setDictChord(null); seek(i); }}
                  style={on ? { background: `linear-gradient(90deg, rgba(255,122,0,.35) ${frac * 100}%, rgba(255,122,0,.08) ${frac * 100}%)` } : undefined}
                  className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-2.5 text-left transition ${
                    on ? 'glow border-brand' : 'border-transparent hover:bg-white/5'
                  } ${i < index ? 'opacity-50' : ''}`}>
                  <span className={`text-lg font-semibold ${on ? 'text-brand' : ''}`}>{b.c}</span>
                  <span className="text-xs text-slate-500">compasso {i + 1}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
