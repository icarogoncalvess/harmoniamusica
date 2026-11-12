import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui/Icon';
import ChordView from '../instruments/ChordView';
import { SUGGESTIONS, answer } from '../../data/faq';

const GREETING = 'Oi! Sou a Harmonia AI. Pergunte sobre afinação, postura, acordes ou como usar o app.';

/**
 * Assistente local: responde com a base de conhecimento de data/faq.js,
 * então funciona mesmo sem internet. Para usar IA online no futuro, troque answer()
 * por um POST ao seu backend, que chama a API do Claude.
 */
export default function Assistant({ instrument = 'violao', left = false }) {
  const [messages, setMessages] = useState([{ from: 'ai', text: GREETING }]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text = draft) => {
    const q = text.trim();
    if (!q || typing) return;
    setDraft('');
    setMessages((m) => [...m, { from: 'me', text: q }]);
    setTyping(true);
    timer.current = setTimeout(() => {
      const res = answer(q, { instrument });
      setMessages((m) => [...m, { from: 'ai', ...res }]);
      setTyping(false);
    }, 300);
  };

  return (
    <div className="flex animate-rise flex-col" style={{ height: 'calc(100dvh - 11rem)' }}>
      <h2 className="mb-3 text-2xl font-bold">Assistente</h2>
      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-line bg-card p-4" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i}
            className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${
              m.from === 'me' ? 'ml-auto bg-line' : 'border border-line bg-ink'
            }`}>
            {m.text}
            {m.chord && (
              <div className="mt-3 rounded-xl bg-card p-2">
                <ChordView chord={m.chord} instrument={instrument} left={left} maxWidth={130} />
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex w-16 gap-1 rounded-2xl border border-line bg-ink px-4 py-3" aria-label="Digitando">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d * 0.12}s` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => send(s)}
            className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs text-slate-300 hover:border-brand/60">
            {s}
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-full border border-line bg-card py-1.5 pl-4 pr-1.5 focus-within:border-brand">
        <input value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Digite sua mensagem..." aria-label="Mensagem"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500" />
        <button onClick={() => send()} aria-label="Enviar"
          className="grid h-9 w-9 place-items-center rounded-full bg-brand text-black">
          <Icon name="send" size={16} />
        </button>
      </div>
    </div>
  );
}
