export const Notes = {
  C2: 36,
  Db2: 37,
  D2: 38,
  Eb2: 39,
  E2: 40,
  F2: 41,
  Gb2: 42,
  G2: 43,
  Ab2: 44,
  A2: 45,
  Bb2: 46,
  B2: 47,
  C3: 48,
} as const;

export interface NoteSound {
  noteValue: number;
  src: string;
}

export const GuitarNoteSounds: NoteSound[] = Object.values(Notes).map((note) => ({
  noteValue: note,
  src: `sound/${note}.mp3`,
}));

export interface BarNotation {
  bar: string;
  notes: number[];
}

export interface MusicScheduler {
  getTimeOffset: (bar: string) => number;
  scheduleNotes: (barNotations: BarNotation[], callback: (noteValue: number) => void) => number[];
}

export function createMusicScheduler(timeSignature: string, tempo: number): MusicScheduler {
  const [beatsPerMeasure, noteValues] = timeSignature.split('/').map((str) => parseInt(str));

  const getTimeOffset = (bar: string) => {
    const barComponents = bar.split('.').map((str) => parseInt(str));

    const offset = barComponents.reduce((prev, current, index) => {
      const value = current - 1;

      if (index === 0) {
        return prev + value * beatsPerMeasure;
      } else {
        return prev + value * (noteValues / noteValues ** index);
      }
    }, 0);

    return offset * (60 / tempo) * 1000;
  };

  const scheduleNotes = (barNotations: BarNotation[], callback: (noteValue: number) => void) => {
    const timeouts: number[] = [];

    for (const notation of barNotations) {
      timeouts.push(
        setTimeout(() => {
          for (const note of notation.notes) {
            callback(note);
          }
        }, getTimeOffset(notation.bar))
      );
    }

    return timeouts;
  };

  return { getTimeOffset, scheduleNotes };
}

export interface MusicPlayer {
  audioPlayers: { [noteValue: number]: HTMLAudioElement };
  timeouts: number[];
  playNote: (noteNumber: number) => void;
  playNotes: (barNotations: BarNotation[]) => void;
  stop: () => void;
}

export function createMusicPlayer(
  scheduler: MusicScheduler,
  noteSounds = GuitarNoteSounds,
  volume = 0.75
): MusicPlayer {
  const audioPlayers: { [noteValue: number]: HTMLAudioElement } = {};
  let timeouts: number[] = [];

  noteSounds.forEach((note) => {
    const audio = new Audio(note.src);
    audio.volume = volume;
    audioPlayers[note.noteValue] = audio;
  });

  const playNote = (noteNumber: number) => {
    audioPlayers[noteNumber].load();
    audioPlayers[noteNumber].play();
  };

  const playNotes = (barNotations: BarNotation[]) => {
    timeouts.push(...scheduler.scheduleNotes(barNotations, playNote));
  };

  const stop = () => {
    timeouts.forEach((timeout) => clearTimeout(timeout));
    timeouts = [];
    Object.values(audioPlayers).forEach((audio) => audio.load());
  };

  return { audioPlayers, timeouts, playNote, playNotes, stop };
}

/**
 * Example `BarNotation` array for a C Major scale
 */
export const cMajScale: BarNotation[] = [
  { bar: '1.1', notes: [Notes.C2] },
  { bar: '1.2', notes: [Notes.D2] },
  { bar: '1.3', notes: [Notes.E2] },
  { bar: '1.4', notes: [Notes.F2] },
  { bar: '2.1', notes: [Notes.G2] },
  { bar: '2.2', notes: [Notes.A2] },
  { bar: '2.3', notes: [Notes.B2] },
  { bar: '2.4', notes: [Notes.C3] },
];

/**
 * Example `BarNotation` array for a C Major chord
 */
export const cMajChord: BarNotation[] = [
  { bar: '1.1.1', notes: [Notes.C2] },
  { bar: '1.1.3', notes: [Notes.E2] },
  { bar: '1.2.1', notes: [Notes.G2] },
  { bar: '1.2.3', notes: [Notes.E2] },
  { bar: '1.3.1', notes: [Notes.C2] },
  { bar: '1.4.1', notes: [Notes.C2, Notes.E2, Notes.G2] },
];
