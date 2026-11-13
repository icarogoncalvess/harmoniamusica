import React, { useState, useEffect } from 'react';
import { useRoute, navigate } from './hooks/useRoute';
import Home from './pages/Home';
import Importer from './pages/Importer';
import SongView from './pages/SongView';
import Learn from './pages/Learn';
import Tuner from './pages/Tuner';
import Icon from './components/ui/Icon';

export default function App() {
  const route = useRoute();
  const [user, setUser] = useState(null);
  const [loginInput, setLoginInput] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('harmoniamusica_user');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginInput.trim()) return;
    localStorage.setItem('harmoniamusica_user', loginInput);
    setUser(loginInput);
    setLoginInput('');
  };

  const handleLogout = () => {
    localStorage.removeItem('harmoniamusica_user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans pb-20">
      {/* Barra Superior / Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div 
          onClick={() => navigate('home')} 
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-xl shadow-lg">
            H
          </div>
          <span className="font-bold text-xl tracking-tight">Harmonia</span>
        </div>

        {/* Links de Navegação rápida */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button onClick={() => navigate('home')} className="hover:text-white transition">Início</button>
          <button onClick={() => navigate('import')} className="hover:text-white transition">Importar</button>
          <button onClick={() => navigate('learn')} className="hover:text-white transition">Aprender</button>
          <button onClick={() => navigate('tuner')} className="text-orange-400 hover:text-orange-300 transition flex items-center gap-1.5">
            <Icon name="music" className="w-4 h-4" /> Afinador
          </button>
        </div>

        {/* Área de Utilizador / Login */}
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-zinc-300">Olá, <strong className="text-white">{user}</strong></span>
              <button 
                onClick={handleLogout}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition"
              >
                Sair
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex gap-2">
              <input
                type="text"
                placeholder="Seu nome..."
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500 w-32 md:w-44"
              />
              <button 
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition shadow"
              >
                Entrar
              </button>
            </form>
          )}
        </div>
      </header>

      {/* Conteúdo Dinâmico Baseado na Rota */}
      <main className="flex-1">
        {route === 'home' && <Home />}
        {route === 'import' && <Importer />}
        {route === 'song' && <SongView />}
        {route === 'learn' && <Learn />}
        {route === 'tuner' && <Tuner />}
      </main>

      {/* Barra de Navegação Inferior (Mobile / Acesso Rápido) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-3 flex justify-around items-center z-50">
        <button onClick={() => navigate('home')} className="flex flex-col items-center text-zinc-400 hover:text-orange-500 text-xs gap-1">
          <Icon name="home" className="w-5 h-5" /> Início
        </button>
        <button onClick={() => navigate('import')} className="flex flex-col items-center text-zinc-400 hover:text-orange-500 text-xs gap-1">
          <Icon name="link" className="w-5 h-5" /> Importar
        </button>
        <button onClick={() => navigate('learn')} className="flex flex-col items-center text-zinc-400 hover:text-orange-500 text-xs gap-1">
          <Icon name="book" className="w-5 h-5" /> Aprender
        </button>
        <button onClick={() => navigate('tuner')} className="flex flex-col items-center text-orange-400 hover:text-orange-300 text-xs gap-1">
          <Icon name="music" className="w-5 h-5" /> Afinador
        </button>
      </nav>
    </div>
  );
}
