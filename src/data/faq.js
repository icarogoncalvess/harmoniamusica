import { CHORDS, CHORD_NAMES, describeChord } from './chords';

/**
 * Base de conhecimento local do assistente: funciona 100% offline.
 * answer(pergunta, { instrument }) devolve { text, chord? } na hora.
 */
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const PT_NAMES = { do: 'C', re: 'D', mi: 'E', fa: 'F', sol: 'G', la: 'A' };
const VERBS = '(?:acorde|tocar|fazer|toco|faco|fa[cç]o|posi[cç][aã]o|posicao|forma)';

/** Descobre se a pergunta é sobre um acorde específico (ex.: "como tocar F?", "acorde de Lá menor"). */
function findChord(raw) {
  const n = norm(raw);
  let m = raw.match(new RegExp(`${VERBS}(?:\\s+d[eoa])?\\s+(?:o\\s+|um\\s+)?([A-G])(m)?(?![\\wÀ-ÿ])`));
  if (m) return { key: m[1] + (m[2] || ''), asked: true };
  m = n.match(/(?:acorde|tocar|fazer|toco|faco|posicao|forma)(?: d[eoa])?\s+(?:o\s+|um\s+)?(do|re|mi|fa|sol|la)(?: (menor)| maior)?\b/);
  if (m) return { key: PT_NAMES[m[1]] + (m[2] ? 'm' : ''), asked: true };
  return null;
}

const INTENTS = [
  { id: 'saudacao', re: [/\b(oi|ola|e ai|opa)\b/, /bom dia|boa tarde|boa noite/],
    text: 'Oi! Eu sou a Harmonia AI. Posso ajudar com afinação, postura, acordes, ritmo e com o uso do app. O que você quer saber?' },
  { id: 'obrigado', re: [/obrigad|valeu|vlw|show/],
    text: 'De nada! Pode perguntar o que quiser, estou aqui para ajudar você a tocar.' },
  { id: 'quem', re: [/quem (e|eh) voce|o que (e|eh) (o )?harmonia|o que voce faz|para que serve/],
    text: 'O Harmonia é um app que ensina música para iniciantes. Você cola o link de uma música do YouTube ou do Spotify e ele mostra os acordes na hora, com o desenho de onde colocar os dedos. Eu sou a assistente que tira as dúvidas.' },
  { id: 'afinar', re: [/afin/, /desafinad|corda.*(frouxa|solta)/, /tarraxa/],
    text: (_q, i) => i === 'ukulele'
      ? 'Ukulele, da corda mais perto do seu rosto para a mais perto do chão: Sol, Dó, Mi, Lá (G C E A). A corda de Sol é a mais aguda. Use um app afinador e gire a tarraxa devagar.'
      : i === 'baixo'
        ? 'Baixo de 4 cordas, da mais grossa para a mais fina: Mi, Lá, Ré, Sol (E A D G). Use um afinador e sempre suba até a nota, em vez de descer.'
        : 'Violão e guitarra, da corda mais grossa para a mais fina: Mi, Lá, Ré, Sol, Si, Mi (E A D G B E).\n1. Abra um app afinador no celular\n2. Toque uma corda solta por vez\n3. Gire a tarraxa devagar até o ponteiro ficar no centro\n4. Se passou da nota, desça um pouco e suba de novo, sempre chegando por baixo' },
  { id: 'postura', re: [/postura/, /como (segur|pego|sento)|segurar o violao|posicao do violao|sentar/],
    text: 'Postura básica sentado:\n1. Costas retas e pés apoiados no chão\n2. Violão apoiado na perna direita (se você é destro)\n3. Braço do violão levemente inclinado para cima\n4. Polegar atrás do braço, dedos curvados, pontas pressionando perto da casa\n5. Ombros e pulso relaxados. Dor é sinal de que está tenso.' },
  { id: 'acorde', re: [/o que (e|sao) (um )?acorde/, /acorde.*(significa|quer dizer)/, /\bque e acorde/],
    text: 'Um acorde é um conjunto de três ou mais notas tocadas juntas. Eles formam a base harmônica da música. Para começar, aprenda C, G, Am e Em: com esses quatro dá para tocar muita coisa.' },
  { id: 'comecar', re: [/comec/, /iniciante|do zero|primeir[ao]s? (aula|passo|musica)/, /por onde|onde eu/],
    text: 'Boa! Um caminho simples:\n1. Conheça o instrumento e aprenda a afinar\n2. Aprenda os acordes Em, Am, C e G\n3. Treine a troca entre dois acordes, bem devagar\n4. Escolha uma música fácil e importe o link aqui no app\n5. Use o loop e a velocidade 0,5x nos trechos difíceis\nA trilha "Violão do zero" na aba Aprender segue essa ordem.' },
  { id: 'dor', re: [/\bdoi|doendo|doer|dor |dor$|calo|ponta dos dedos|machuc|sangr/],
    text: 'Dor nas pontas dos dedos no começo é normal. Pratique 10 a 15 minutos por vez, várias vezes ao dia. Em algumas semanas os calos se formam e passa. Se a dor for no pulso ou no antebraço, pare e revise a postura.' },
  { id: 'trocar', re: [/troc(ar|a)|mudar de acorde|transic|trocando/, /rapido|travo|travando/],
    text: 'Para trocar de acorde sem travar:\n1. Treine só duas cifras, em câmera lenta (0,5x no player)\n2. Prepare o próximo acorde antes da batida: o app avisa "Prepare o..." na metade do compasso\n3. Procure dedos que não precisam sair do lugar (guia)\n4. Use o loop para repetir o mesmo trecho até ficar natural' },
  { id: 'pestana', re: [/pestana|barre|f (e|eh) dificil|acorde f\b/],
    text: 'A pestana (acorde F) é difícil para todo mundo no começo. Use a lateral do indicador, não a ponta, e deixe o cotovelo mais perto do corpo. Enquanto não sai, toque a versão simplificada do F (só as 4 cordas mais finas). Treine alguns minutos por dia.' },
  { id: 'ritmo', re: [/ritmo|batida|palhet|dedilhad|strum/],
    text: 'Uma batida fácil para começar: baixo, baixo, cima, cima, baixo, cima (B B C C B C). Conte "1 e 2 e 3 e 4 e" e mantenha a mão solta, como se sacudisse. O mais importante é não parar o movimento, mesmo quando você erra o acorde.' },
  { id: 'cifra', re: [/cifra|partitura|pauta|ler musica|ler nota|solfejo/],
    text: 'A cifra mostra só o nome dos acordes (C, G, Am...) e é o jeito mais rápido de começar. A partitura mostra cada nota na pauta e ajuda a entender ritmo e melodia. No Harmonia, alterne entre Modo prático (cifras e diagramas) e Modo partitura (pauta sincronizada).' },
  { id: 'importar', re: [/importar|colar|link|youtube|spotify/, /como (usa|uso).*(app|harmonia)/],
    text: 'Para tocar a sua música favorita:\n1. Vá em Importar\n2. Escolha o instrumento\n3. Cole o link do YouTube ou do Spotify\n4. Aperte "Gerar cifra e diagramas" e aguarde a análise\n5. Dê play: os acordes avançam sozinhos e o diagrama mostra onde pôr os dedos' },
  { id: 'loop', re: [/loop|velocidade|devagar|lento|repetir|desacelerar/],
    text: 'Na tela da música, use 0,5x ou 0,75x para tocar mais devagar e o botão "Loop" para repetir a seção atual até dominar o trecho.' },
  { id: 'canhoto', re: [/canhoto|esquerd|mao esquerda/],
    text: 'Se você é canhoto, ative "Modo canhoto" na tela da música. Os diagramas são espelhados na hora.' },
  { id: 'praticar', re: [/quanto tempo|treinar|praticar|rotina|estudar|todo dia/],
    text: 'Constância vale mais que quantidade. 15 a 30 minutos por dia rendem mais do que 3 horas uma vez por semana. Uma rotina boa: 5 min afinando e aquecendo, 10 min de troca de acordes, 10 min tocando uma música.' },
  { id: 'capotraste', re: [/capo/],
    text: 'O capotraste prende todas as cordas numa casa e sobe o tom da música sem mudar as formas dos acordes. Ajuda a adaptar a música à sua voz e a usar acordes mais fáceis.' },
  { id: 'instrumento', re: [/qual instrumento|melhor instrumento|violao ou guitarra|ukulele ou violao/],
    text: 'Para começar, o violão (cordas de nylon, mais macias) e o ukulele (4 cordas) são os mais amigáveis. A guitarra usa as mesmas formas de acorde do violão. O Harmonia tem diagramas para violão, guitarra, piano, baixo e ukulele.' },
  { id: 'piano', re: [/piano|teclado/],
    text: 'Selecione "Piano" na lista de instrumentos: o app destaca no teclado as notas de cada acorde. Comece com C, F e G e use a mão direita para as três notas juntas.' },
  { id: 'banda', re: [/banda|tocar com (amigos|outros)|grupo|ensaio/],
    text: 'Para tocar em banda: combinem o andamento (bpm) antes de começar, ouçam uns aos outros e tentem fechar juntos a troca de acordes. Usar a mesma cifra e a mesma tonalidade evita confusão no ensaio.' },
];

const SUGGESTIONS_TEXT = 'Posso ajudar com: afinar o instrumento, postura, posição de acordes (ex.: "como tocar o G?"), trocar de acorde, ritmo, cifra e partitura, e como usar o app.';

export const SUGGESTIONS = ['Por onde eu começo?', 'Como afinar o violão?', 'Como tocar o G?', 'Qual a postura certa?', 'Como trocar de acorde mais rápido?'];

export function answer(question, { instrument = 'violao' } = {}) {
  const raw = question.trim();
  const n = norm(raw);

  const chord = findChord(raw);
  if (chord) {
    if (!CHORDS[chord.key]) {
      return { text: `Esse acorde ainda não está no meu dicionário. Tenho: ${Object.keys(CHORDS).join(', ')}.` };
    }
    const lines = describeChord(instrument, chord.key).join('\n');
    const extra = chord.key === 'F' ? '\nDica: o F usa pestana. Se estiver difícil, veja a dica sobre pestana.' : '';
    return { text: `${chord.key} (${CHORD_NAMES[chord.key]}):\n${lines}${extra}`, chord: chord.key };
  }

  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const score = intent.re.filter((r) => r.test(n)).length;
    if (score > bestScore) { best = intent; bestScore = score; }
  }
  if (!best) return { text: `Hmm, não entendi essa. ${SUGGESTIONS_TEXT}` };
  return { text: typeof best.text === 'function' ? best.text(n, instrument) : best.text };
}
