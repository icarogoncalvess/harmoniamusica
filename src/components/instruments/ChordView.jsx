import { CHORDS, fingersFor, fretsFor, stringLabelsFor } from '../../data/chords';
import Fret from './Fret';
import Piano from './Piano';

/** Escolhe o diagrama certo conforme o instrumento. */
export default function ChordView({ chord, instrument, left, maxWidth, compact = false }) {
  if (!CHORDS[chord]) return null;
  if (instrument === 'piano') return <Piano pc={CHORDS[chord].pc} />;
  return (
    <Fret
      frets={fretsFor(instrument, chord)}
      fingers={fingersFor(instrument, chord)}
      labels={stringLabelsFor(instrument)}
      left={left}
      compact={compact}
      maxWidth={maxWidth}
    />
  );
}
