import { useState } from 'react';
import { Icon, Logo } from './components/ui/Icon';
import Assistant from './components/chat/Assistant';
import { navigate, useRoute } from './hooks/useRoute';
import { SONGS } from './data/songs';
import Home from './pages/Home';
import Importer from './pages/Importer';
import Learn from './pages/Learn';
import SongView from './pages/SongView';

const NAV = [
  ['home', 'Início', 'home'],
  ['import', 'Importar', 'link'],
  ['learn', 'Aprender', 'book'],
  ['assistant', 'Assistente', 'chat'],
];

export default function App() {
  const route = useRoute();
  const [instrument, setInstrument] = useState('violao');
  const [song, setSong] = useState(null);
  const [left, setLeft] = useState(false);

  const openDemo = () => {
    setSong({ ...SONGS[0], src: 'YouTube' });
    navigate('song');
  };

  let page;
  if (route === 'import' || (route === 'song' && !song)) {
    page = <Importer instrument={instrument} setInstrument={setInstrument} onImport={setSong} />;
  } else if (route === 'song') {
    page = <SongView key={song.title} song={song} instrument={instrument} setInstrument={setInstrument} left={left} setLeft={setLeft} />;
  } else if (route === 'learn') {
    page = <Learn />;
  } else if (route === 'assistant') {
    page = <Assistant instrument={instrument} left={left} />;
  } else {
    page = <Home song={song} onDemo={openDemo} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-5">
      <header className="mb-5 flex items-center gap-2">
        <Logo size={28} />
        <span className="text-lg font-bold">Harmonia</span>
      </header>
      <main>{page}</main>

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-ink/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="mx-auto flex max-w-md justify-around py-2">
          {NAV.map(([key, label, icon]) => {
            const active = route === key || (route === 'song' && key === 'import');
            return (
              <button key={key} onClick={() => navigate(key)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition ${active ? 'text-brand' : 'text-slate-500'}`}>
                <Icon name={icon} />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
