/**
 * Catálogo de demonstração. Cada compasso tem a cifra (c) e uma nota simulada
 * da partitura (n, entre C4 e C5). Em produção, estes dados virão da análise da faixa.
 */
const section = (name, list) => ({ name, bars: list.map(([c, n]) => ({ c, n })) });

export const SONGS = [
  {
    title: 'Céu de Domingo', artist: 'Artista Exemplo', bpm: 84, key: 'C', hue: 25, level: 'Iniciante',
    tip: 'Comece só com C e G. Quando trocar sem travar, adicione Am e F.',
    sections: [
      section('Intro', [['C', 'E4'], ['G', 'D4'], ['Am', 'C5'], ['F', 'A4']]),
      section('Verso', [['C', 'G4'], ['G', 'B4'], ['Am', 'A4'], ['F', 'F4'], ['C', 'E4'], ['G', 'D4'], ['F', 'A4'], ['F', 'F4']]),
      section('Refrão', [['F', 'C5'], ['C', 'G4'], ['G', 'B4'], ['Am', 'A4'], ['F', 'A4'], ['C', 'E4'], ['G', 'D4'], ['G', 'G4']]),
    ],
  },
  {
    title: 'Primeiros Acordes', artist: 'Harmonia Aulas', bpm: 64, key: 'G', hue: 140, level: 'Iniciante',
    tip: 'Andamento lento de propósito: use o loop para repetir a troca de Em para Am.',
    sections: [
      section('Aquecimento', [['Em', 'G4'], ['Am', 'E4'], ['Em', 'B4'], ['Am', 'C5']]),
      section('Música', [['G', 'D4'], ['D', 'F4'], ['Em', 'G4'], ['Am', 'A4'], ['G', 'B4'], ['D', 'A4'], ['Em', 'E4'], ['G', 'G4']]),
    ],
  },
  {
    title: 'Estrada Longa', artist: 'Banda Modelo', bpm: 96, key: 'G', hue: 200, level: 'Iniciante',
    tip: 'Troque de acorde um pouco antes da batida. Preparar o dedo cedo é o segredo.',
    sections: [
      section('Intro', [['G', 'G4'], ['D', 'F4'], ['Em', 'E4'], ['C', 'E4']]),
      section('Verso', [['G', 'B4'], ['D', 'A4'], ['Em', 'G4'], ['C', 'G4'], ['G', 'D4'], ['D', 'F4'], ['C', 'E4'], ['C', 'C4']]),
      section('Refrão', [['C', 'C5'], ['G', 'B4'], ['D', 'A4'], ['Em', 'G4'], ['C', 'E4'], ['G', 'D4'], ['D', 'F4'], ['D', 'D4']]),
    ],
  },
  {
    title: 'Maré Baixa', artist: 'Duo Teste', bpm: 72, key: 'Am', hue: 300, level: 'Intermediário',
    tip: 'O Dm aparece no refrão. Treine a troca de Dm para Am em câmera lenta (0,5x).',
    sections: [
      section('Verso', [['Am', 'A4'], ['F', 'A4'], ['C', 'G4'], ['G', 'B4'], ['Am', 'C5'], ['F', 'F4'], ['G', 'D4'], ['G', 'G4']]),
      section('Refrão', [['Dm', 'D4'], ['Am', 'E4'], ['F', 'F4'], ['C', 'G4'], ['Dm', 'A4'], ['Am', 'C5'], ['G', 'B4'], ['G', 'G4']]),
    ],
  },
  {
    // ✏️ PERSONALIZE: troque título, artista e acordes pela música da sua banda.
    title: 'Sua Música', artist: 'Sua Banda', bpm: 90, key: 'G', hue: 45, level: 'Iniciante',
    tip: 'Esta é a música da banda: edite src/data/songs.js para colocar a cifra real.',
    sections: [
      section('Intro', [['G', 'G4'], ['D', 'F4'], ['Em', 'E4'], ['C', 'E4']]),
      section('Verso', [['G', 'D4'], ['D', 'A4'], ['Em', 'B4'], ['C', 'G4'], ['G', 'B4'], ['D', 'A4'], ['C', 'E4'], ['C', 'G4']]),
      section('Refrão', [['C', 'C5'], ['D', 'A4'], ['G', 'B4'], ['Em', 'G4'], ['C', 'E4'], ['D', 'F4'], ['G', 'G4'], ['G', 'D4']]),
    ],
  },
];

/** Sempre devolve uma música válida do catálogo, de forma determinística a partir do link. */
export function pickSong(url = '') {
  const hash = [...String(url)].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return SONGS[hash % SONGS.length] ?? SONGS[0];
}
