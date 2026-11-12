import { Icon, Logo } from '../components/ui/Icon';
import { navigate } from '../hooks/useRoute';

const FEATURES = [
  ['Aprenda a tocar', 'seu instrumento', 'import'],
  ['Conheça artistas', 'do Brasil e do mundo', 'learn'],
  ['Educação musical', 'para todos', 'learn'],
  ['Tire dúvidas', 'com a Harmonia AI', 'assistant'],
];

export default function Home({ song, onDemo }) {
  return (
    <div className="animate-rise space-y-8">
      <section className="overflow-hidden rounded-3xl border border-line p-6 text-center sm:p-10"
        style={{ background: 'radial-gradient(circle at 50% 0%, #2a1a0a, #0B0D10 70%)' }}>
        <div className="flex justify-center"><Logo size={64} /></div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Harmonia</h1>
        <p className="mx-auto mt-2 max-w-md text-slate-400">
          Seu companheiro na jornada pela música. Cole um link e comece a tocar hoje.
        </p>
        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3">
          <button onClick={() => navigate('import')}
            className="rounded-full bg-brand py-3.5 font-semibold text-black transition hover:brightness-110 active:scale-95">
            Começar
          </button>
          <button onClick={onDemo}
            className="rounded-full border border-brand/50 py-3 text-sm font-medium text-brand transition hover:bg-brand/10">
            Ver demonstração
          </button>
          <button onClick={() => navigate('learn')} className="text-sm text-slate-300 underline underline-offset-4">
            Já tenho uma conta
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FEATURES.map(([title, sub, route]) => (
          <button key={title} onClick={() => navigate(route)}
            className="rounded-2xl border border-line bg-card p-4 text-left transition hover:border-brand/60">
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-slate-400">{sub}</div>
          </button>
        ))}
      </section>

      {song && (
        <button onClick={() => navigate('song')}
          className="flex w-full items-center gap-4 rounded-2xl border border-line bg-card p-4 text-left">
          <div className="h-14 w-14 rounded-xl"
            style={{ background: `linear-gradient(135deg, hsl(${song.hue} 90% 50%), #14181D)` }} />
          <div className="flex-1">
            <div className="text-xs text-brand">Continuar tocando</div>
            <div className="font-semibold">{song.title}</div>
            <div className="text-sm text-slate-400">{song.artist}</div>
          </div>
          <Icon name="play" />
        </button>
      )}
    </div>
  );
}
