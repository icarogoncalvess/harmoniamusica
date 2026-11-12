import { useState } from 'react';
import { Icon } from '../components/ui/Icon';

const MODULES = [
  'Introdução e postura',
  'Acordes maiores (C, G, D, Em)',
  'Acordes menores (Am, Dm, Em)',
  'Trocando entre acordes',
  'Primeira música',
];

function ProgressBar({ value, total }) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
      <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${(value / total) * 100}%` }} />
    </div>
  );
}

export default function Learn() {
  const [done, setDone] = useState(1);
  const courses = [
    ['Violão do zero', done, MODULES.length],
    ['Teoria musical básica', 2, 8],
    ['História da música', 0, 6],
  ];

  return (
    <div className="animate-rise space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Aprender</h2>
        <p className="text-slate-400">Trilhas para começar do zero.</p>
      </div>

      <div className="space-y-3">
        {courses.map(([name, value, total]) => (
          <div key={name} className="rounded-2xl border border-line bg-card p-4">
            <div className="flex justify-between">
              <span className="font-semibold">{name}</span>
              <span className="text-sm text-slate-400">{value}/{total} concluídos</span>
            </div>
            <ProgressBar value={value} total={total} />
          </div>
        ))}
      </div>

      <h3 className="font-semibold">Módulos: Violão do zero</h3>
      <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
        {MODULES.map((title, i) => {
          const state = i < done ? 'done' : i === done ? 'now' : 'locked';
          return (
            <li key={title} className="flex items-center gap-3 p-4">
              <span className={`grid h-8 w-8 place-items-center rounded-full border text-sm ${
                state === 'done' ? 'border-brand text-brand' : 'border-line text-slate-500'
              }`}>{i + 1}</span>
              <div className="flex-1">
                <div className={state === 'locked' ? 'text-slate-500' : ''}>{title}</div>
                <div className={`text-xs ${
                  state === 'done' ? 'text-emerald-400' : state === 'now' ? 'text-brand' : 'text-slate-600'
                }`}>
                  {state === 'done' ? 'Concluído' : state === 'now' ? 'Em andamento' : 'Bloqueado'}
                </div>
              </div>
              {state === 'now' ? (
                <button onClick={() => setDone(done + 1)}
                  className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-black">Concluir</button>
              ) : (
                <span className={state === 'done' ? 'text-emerald-400' : 'text-slate-600'}>
                  <Icon name={state === 'done' ? 'check' : 'lock'} size={18} />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
