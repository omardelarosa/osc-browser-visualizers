var notes = [
    120,
    122,
    124,
    125,
    127
];

var i = 0;

function loop() {
    playNote(notes[i] + 24);
    i++;
    if (i >= notes.length) {
        i = 0;
    }
}
