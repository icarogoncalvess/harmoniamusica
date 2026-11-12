import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import InstPicker from '../components/instruments/InstPicker';
import { SONGS, pickSong } from '../data/songs';
import { navigate } from '../hooks/useRoute';

const MESSAGES = ['Identificando a faixa...', 'Extraindo metadados...', 'Analisando estrutura harmônica...'];
const DURATION = 2000;

/** Aceita links com ou sem https, de computador ou celular. */
function detectSource(raw) {
  const url = raw.trim().toLowerCase();
  if (/(youtube\.com|youtu\.be)/.test(url)) return 'YouTube';
  if (/(spotify\.com|spotify\.link|^spotify:)/.test(url)) return 'Spotify';
  return null;
}

export default function Importer({ instrument, setInstrument, onImport }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState(-1); // -1 = parado
  const timers = useRef([]);
  const loading = msg >= 0;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const submit = () => {
    if (loading) return;
    const source = detectSource(url);
    if (!source) return setError('Cole um link do YouTube ou do Spotify.');
    setError('');
    setMsg(0);
    // Simulação: sempre termina em 2 segundos com uma música do catálogo.
    // Em produção, troque por uma chamada ao seu backend (YouTube Data API / Spotify Web API).
    timers.current = [
      setTimeout(() => setMsg(1), DURATION * 0.3),
      setTimeout(() => setMsg(2), DURATION * 0.6),
      setTimeout(() => {
        onImport({ ...(pickSong(url) ?? SONGS[0]), src: source });
        navigate('song');
      }, DURATION),
    ];
  };

  return (
    <div className="animate-rise space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Importar música</h2>
        <p className="text-slate-400">Cole o link da música que você quer aprender.</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-card px-4 py-3 focus-within:border-brand">
          <Icon name="link" />
          <input value={url} disabled={loading} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()} aria-label="Link da música"
            placeholder="https://youtu.be/... ou open.spotify.com/track/..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500" />
        </div>
        {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Testar:</span>
          <button disabled={loading} onClick={() => { setUrl('https://youtu.be/exemplo123'); setError(''); }}
            className="rounded-full border border-line px-3 py-1 hover:border-brand/60">link YouTube</button>
          <button disabled={loading} onClick={() => { setUrl('https://open.spotify.com/track/exemplo456'); setError(''); }}
            className="rounded-full border border-line px-3 py-1 hover:border-brand/60">link Spotify</button>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-300">Escolha seu instrumento</h3>
        <InstPicker value={instrument} onChange={setInstrument} />
      </div>

      {!loading ? (
        <button onClick={submit}
          className="w-full rounded-full bg-brand py-3.5 font-semibold text-black transition hover:brightness-110 active:scale-95">
          Gerar cifra e diagramas
        </button>
      ) : (
        <div className="rounded-2xl border border-brand/40 bg-card p-5" role="status" aria-live="polite">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand" />
            <span className="font-medium">{MESSAGES[msg]}</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
            <div className="fill-2s h-full rounded-full bg-brand" />
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-600">Protótipo: as faixas vêm de um catálogo de demonstração.</p>
    </div>
  );
}
