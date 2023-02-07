"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cMajChord = exports.cMajScale = exports.createMusicPlayer = exports.createMusicScheduler = exports.GuitarNoteSounds = exports.Notes = void 0;
exports.Notes = {
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
};
exports.GuitarNoteSounds = Object.values(exports.Notes).map((note) => ({
    noteValue: note,
    src: `sound/${note}.mp3`,
}));
function createMusicScheduler(timeSignature, tempo) {
    const [beatsPerMeasure, noteValues] = timeSignature.split('/').map((str) => parseInt(str));
    const getTimeOffset = (bar) => {
        const barComponents = bar.split('.').map((str) => parseInt(str));
        const offset = barComponents.reduce((prev, current, index) => {
            const value = current - 1;
            if (index === 0) {
                return prev + value * beatsPerMeasure;
            }
            else {
                return prev + value * (noteValues / noteValues ** index);
            }
        }, 0);
        return offset * (60 / tempo) * 1000;
    };
    const scheduleNotes = (barNotations, callback) => {
        const timeouts = [];
        for (const notation of barNotations) {
            timeouts.push(setTimeout(() => {
                for (const note of notation.notes) {
                    callback(note);
                }
            }, getTimeOffset(notation.bar)));
        }
        return timeouts;
    };
    return { getTimeOffset, scheduleNotes };
}
exports.createMusicScheduler = createMusicScheduler;
function createMusicPlayer(scheduler, noteSounds = exports.GuitarNoteSounds, volume = 0.75) {
    const audioPlayers = {};
    let timeouts = [];
    noteSounds.forEach((note) => {
        const audio = new Audio(note.src);
        audio.volume = volume;
        audioPlayers[note.noteValue] = audio;
    });
    const playNote = (noteNumber) => {
        audioPlayers[noteNumber].load();
        audioPlayers[noteNumber].play();
    };
    const playNotes = (barNotations) => {
        timeouts.push(...scheduler.scheduleNotes(barNotations, playNote));
    };
    const stop = () => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
        timeouts = [];
        Object.values(audioPlayers).forEach((audio) => audio.load());
    };
    return { audioPlayers, timeouts, playNote, playNotes, stop };
}
exports.createMusicPlayer = createMusicPlayer;
/**
 * Example `BarNotation` array for a C Major scale
 */
exports.cMajScale = [
    { bar: '1.1', notes: [exports.Notes.C2] },
    { bar: '1.2', notes: [exports.Notes.D2] },
    { bar: '1.3', notes: [exports.Notes.E2] },
    { bar: '1.4', notes: [exports.Notes.F2] },
    { bar: '2.1', notes: [exports.Notes.G2] },
    { bar: '2.2', notes: [exports.Notes.A2] },
    { bar: '2.3', notes: [exports.Notes.B2] },
    { bar: '2.4', notes: [exports.Notes.C3] },
];
/**
 * Example `BarNotation` array for a C Major chord
 */
exports.cMajChord = [
    { bar: '1.1.1', notes: [exports.Notes.C2] },
    { bar: '1.1.3', notes: [exports.Notes.E2] },
    { bar: '1.2.1', notes: [exports.Notes.G2] },
    { bar: '1.2.3', notes: [exports.Notes.E2] },
    { bar: '1.3.1', notes: [exports.Notes.C2] },
    { bar: '1.4.1', notes: [exports.Notes.C2, exports.Notes.E2, exports.Notes.G2] },
];
//# sourceMappingURL=index.js.map