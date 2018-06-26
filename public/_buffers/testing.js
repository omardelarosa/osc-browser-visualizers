// setTempo(120);

var notes = [
    'C4',
    'E4',
    'G4',
    'C5',
    'G5',
    'E5'
];

if (!window.pulse) {
    window.pulse = 1;
}

let c = (s) => s.replace(/\s/g,'').split('').map(Number);

let kicks = c('1000 0010 0001 0010');
let hats = c('1111 1111 1111 1111');
let snares = c('0000 1000 0000 1000');

loop('pulse', async (ctx) => {
    window.pulse++;
    ctx.sleep(T/4)
});

// TODO: make a general API here.
loop("blah", async (ctx) => {
    let i = window.pulse % notes.length;
    const outs = getOutputs();
    const tr = outs[2];
    const synth = outs[3];

    // Play scale
    synth.playNote(notes[i], 1, { velocity: 0.9 })
        .stopNote(notes[i], 1, { time: '+100' })

    ctx.sleep(T/2);
});

loop("kicks", async (ctx) => {
    if (!kicks[window.pulse % 16]) return ctx.sleep(T/4);
    const outs = await getOutputs();
    const tr = outs[2];

    // Play kick beat
    tr.playNote(36, 1, { velocity: 0.9 })
        .stopNote(36, 1, { time: '+100' })

    ctx.sleep(T/4);
});

loop('hats', async (ctx) => {
    if (!hats[window.pulse % 16]) return ctx.sleep(T/4);

    const outs = await getOutputs();
    const tr = outs[2];

    tr.playNote(42, 1, { velocity: 0.4 })
        .stopNote(42, 1, { time: '+100' });
    
    ctx.sleep(T/4);
});

loop('snares', async (ctx) => {
    if (!snares[window.pulse % 16]) return ctx.sleep(T/4);

    const outs = await getOutputs();
    const tr = outs[2];

    tr.playNote(38, 1, { velocity: 0.4 })
        .stopNote(38, 1, { time: '+100' });
    
    ctx.sleep(T/4);
});
