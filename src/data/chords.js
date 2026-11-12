/**
 * Dicionário de acordes.
 * g / fi : violão e guitarra (cordas E A D G B e). g = casa (-1 abafada, 0 solta), fi = dedo (0 = nenhum)
 * u / ufi: ukulele (G C E A)
 * bf     : casa da tônica na corda Mi do baixo
 * pc     : classes de altura (0 = Dó ... 11 = Si) para o teclado
 */
export const CHORDS = {
  C:  { g: [-1, 3, 2, 0, 1, 0],  fi: [0, 3, 2, 0, 1, 0], u: [0, 0, 0, 3], ufi: [0, 0, 0, 3], bf: 8,  pc: [0, 4, 7] },
  G:  { g: [3, 2, 0, 0, 0, 3],   fi: [2, 1, 0, 0, 0, 3], u: [0, 2, 3, 2], ufi: [0, 1, 3, 2], bf: 3,  pc: [7, 11, 2] },
  Am: { g: [-1, 0, 2, 2, 1, 0],  fi: [0, 0, 2, 3, 1, 0], u: [2, 0, 0, 0], ufi: [2, 0, 0, 0], bf: 5,  pc: [9, 0, 4] },
  F:  { g: [1, 3, 3, 2, 1, 1],   fi: [1, 3, 4, 2, 1, 1], u: [2, 0, 1, 0], ufi: [2, 0, 1, 0], bf: 1,  pc: [5, 9, 0] },
  D:  { g: [-1, -1, 0, 2, 3, 2], fi: [0, 0, 0, 1, 3, 2], u: [2, 2, 2, 0], ufi: [1, 2, 3, 0], bf: 10, pc: [2, 6, 9] },
  Em: { g: [0, 2, 2, 0, 0, 0],   fi: [0, 2, 3, 0, 0, 0], u: [0, 4, 3, 2], ufi: [0, 3, 2, 1], bf: 0,  pc: [4, 7, 11] },
  Dm: { g: [-1, -1, 0, 2, 3, 1], fi: [0, 0, 0, 2, 3, 1], u: [2, 2, 1, 0], ufi: [2, 3, 1, 0], bf: 10, pc: [2, 5, 9] },
  A:  { g: [-1, 0, 2, 2, 2, 0],  fi: [0, 0, 1, 2, 3, 0], u: [2, 1, 0, 0], ufi: [2, 1, 0, 0], bf: 5,  pc: [9, 1, 4] },
  E:  { g: [0, 2, 2, 1, 0, 0],   fi: [0, 2, 3, 1, 0, 0], u: [4, 4, 4, 2], ufi: [3, 3, 3, 1], bf: 0,  pc: [4, 8, 11] },
};

export const CHORD_NAMES = {
  C: 'Dó maior', G: 'Sol maior', Am: 'Lá menor', F: 'Fá maior', D: 'Ré maior',
  Em: 'Mi menor', Dm: 'Ré menor', A: 'Lá maior', E: 'Mi maior',
};

export const INSTRUMENTS = {
  violao: 'Violão',
  guitarra: 'Guitarra',
  piano: 'Piano',
  baixo: 'Baixo',
  ukulele: 'Ukulele',
};

const NOTE_NAMES = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];
const STRING_NAMES = {
  violao: ['Mi grave', 'Lá', 'Ré', 'Sol', 'Si', 'Mi agudo'],
  ukulele: ['Sol', 'Dó', 'Mi', 'Lá'],
  baixo: ['Mi', 'Lá', 'Ré', 'Sol'],
};
export const STRING_LABELS = {
  violao: ['Mi', 'Lá', 'Ré', 'Sol', 'Si', 'Mi'],
  ukulele: ['Sol', 'Dó', 'Mi', 'Lá'],
  baixo: ['Mi', 'Lá', 'Ré', 'Sol'],
};

const family = (instrument) => (instrument === 'guitarra' ? 'violao' : instrument);

export const stringLabelsFor = (instrument) => STRING_LABELS[family(instrument)] || [];

/** Casas pressionadas em cada corda (violão e guitarra compartilham as formas básicas). */
export function fretsFor(instrument, chord) {
  const c = CHORDS[chord];
  if (!c) return null;
  if (instrument === 'ukulele') return c.u;
  if (instrument === 'baixo') return [c.bf, -1, -1, -1];
  return c.g;
}

/** Dedo usado em cada corda (0 = nenhum). */
export function fingersFor(instrument, chord) {
  const c = CHORDS[chord];
  if (!c) return [];
  if (instrument === 'ukulele') return c.ufi;
  if (instrument === 'baixo') return [];
  return c.fi;
}

/** Instruções em texto para iniciantes. */
export function describeChord(instrument, chord) {
  const c = CHORDS[chord];
  if (!c) return [];
  if (instrument === 'piano') return [`Notas: ${c.pc.map((p) => NOTE_NAMES[p]).join(' · ')}`];
  const frets = fretsFor(instrument, chord);
  const fingers = fingersFor(instrument, chord);
  const names = STRING_NAMES[family(instrument)];
  const lines = [];
  frets.forEach((f, i) => {
    if (f > 0) lines.push(`${fingers[i] ? `Dedo ${fingers[i]}` : 'Tecle'}: corda ${names[i]}, casa ${f}`);
  });
  const muted = frets.map((f, i) => (f < 0 ? names[i] : null)).filter(Boolean);
  if (muted.length) lines.push(`Não toque: ${muted.join(', ')}`);
  return lines;
}
