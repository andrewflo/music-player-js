export declare const Notes: {
    readonly C2: 36;
    readonly Db2: 37;
    readonly D2: 38;
    readonly Eb2: 39;
    readonly E2: 40;
    readonly F2: 41;
    readonly Gb2: 42;
    readonly G2: 43;
    readonly Ab2: 44;
    readonly A2: 45;
    readonly Bb2: 46;
    readonly B2: 47;
    readonly C3: 48;
};
export interface NoteSound {
    noteValue: number;
    src: string;
}
export declare const GuitarNoteSounds: NoteSound[];
export interface BarNotation {
    bar: string;
    notes: number[];
}
export interface MusicScheduler {
    getTimeOffset: (bar: string) => number;
    scheduleNotes: (barNotations: BarNotation[], callback: (noteValue: number) => void) => number[];
}
export declare function createMusicScheduler(timeSignature: string, tempo: number): MusicScheduler;
export interface MusicPlayer {
    audioPlayers: {
        [noteValue: number]: HTMLAudioElement;
    };
    timeouts: number[];
    playNote: (noteNumber: number) => void;
    playNotes: (barNotations: BarNotation[]) => void;
    stop: () => void;
}
export declare function createMusicPlayer(scheduler: MusicScheduler, noteSounds?: NoteSound[], volume?: number): MusicPlayer;
/**
 * Example `BarNotation` array for a C Major scale
 */
export declare const cMajScale: BarNotation[];
/**
 * Example `BarNotation` array for a C Major chord
 */
export declare const cMajChord: BarNotation[];
