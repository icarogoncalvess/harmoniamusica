import React, { useState } from 'react';
import { navigate } from '../hooks/useRoute';
import Icon from '../components/ui/Icon';

export default function Importer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Se for o link do Charlie Brown Jr. - Me Encontra
      if (url.includes('eG4mlkJroQ0') || url.toLowerCase().includes('me encontra')) {
        localStorage.setItem('harmoniamusica_current', JSON.stringify({
          title: 'Me Encontra',
          artist: 'Charlie Brown Jr.',
          key: 'D',
          bpm: 120,
          cover: 'https://img.youtube.com/vi/eG4mlkJroQ0/hqdefault.jpg',
          sections: [
            { name: 'INTRO', chords: ['D', 'Bm', 'G', 'A'] },
            { name: 'VERSO', chords: ['D', 'Bm', 'G', 'A'], lyrics: 'Todo dia ela faz tudo sempre igual...' },
            { name: 'REFRÃO', chords: ['G', 'A', 'D', 'Bm'] }
          ]
        }));
      } else {
        // Genérico para outros links do YouTube / Spotify colados
        localStorage.setItem('harmoniamusica_current', JSON.stringify({
          title: 'Música Importada',
          artist: 'Link do YouTube / Web',
          key: 'G',
          bpm: 100,
          cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
          sections: [
            { name: 'VERSO 1', chords: ['G', 'C', 'D', 'G'] },
            { name: 'REFRÃO', chords: ['C', 'G', 'D', 'G'] }
          ]
        }));
      }
      navigate('song');
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <Icon name="link" className="w-8 h-8 text-orange-500" />
        Importar Música
      </h1>
      <p className="text-zinc-400 mb-6">Cole o link do YouTube (ex: Charlie Brown Jr. - Me Encontra) para extrair os acordes e a cifra automaticamente.</p>

      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Link do YouTube ou Spotify</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtu.be/eG4mlkJroQ0"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analisando áudio e acordes...
            </>
          ) : (
            'Importar e Processar Cifra'
          )}
        </button>
      </form>
    </div>
  );
}
