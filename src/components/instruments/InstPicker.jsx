import { INSTRUMENTS } from '../../data/chords';

export default function InstPicker({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {Object.entries(INSTRUMENTS).map(([key, label]) => (
        <button key={key} onClick={() => onChange(key)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
            value === key
              ? 'border-brand bg-brand font-semibold text-black'
              : 'border-line bg-card text-slate-300 hover:border-brand/50'
          }`}>
          {label}
        </button>
      ))}
    </div>
  );
}
