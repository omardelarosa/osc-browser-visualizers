var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

let tick = 0;
let T = 24; // Ticks in beat
let sleeps = 0;

function loop() {
    // noop
}

function sleep(ticks) {
    if (sleeps <= 0) {
        sleeps = ticks;
    }
}

function setTempo(bpm) {
    fetch('http://localhost:8081/updateBpm', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ bpm })
    }).then((res) => {
        console.log('BPM updated', res.json());
    });
}

const playNote = (n) => {
    console.log('NOTE!', n);
    oscillator = context.createOscillator();
    oscillator.frequency.value = n;
    oscillator.connect(context.destination);
    oscillator.start(0);
    setTimeout(() => {
        oscillator.stop(0);
    }, 100)
}

const loadBuffer = (b) => {
    const $buffers = document.querySelectorAll('.buffer-script');
    $buffers.forEach(b => b.remove());
    const $buffer = document.createElement('script');
    const ts = Date.now();
    $buffer.src = `/_buffers/${b}?${ts}`;
    $buffer.className = 'buffer-script';
    document.body.appendChild($buffer);
}

// DATA container
let data = [];
let avgGap = 0;
let minLatency = 10;
let lastBeat = 0;
let lastTimeDelta = 0;
let minDelta = 0;

let beatCounter = 0;

function doBeat() {
    t2 = Date.now();
    if (lastBeat === 0) {
        lastBeat = t2;
        loop();
    } else {
        const currentDelta = t2 - lastBeat;
        const deltaDiff = currentDelta - lastTimeDelta;
        lastTimeDelta = currentDelta;
        const beat = t2 - lastBeat;
        // decrement sleeps
        if (sleeps > 0) {
            sleeps -= 1;
        } else if (deltaDiff < -10) {
            // Ahead of time, schedule for later
            setTimeout(() => loop(beat), deltaDiff * -1);
        } else {
            // behind time... TODO:
            loop(beat);
        }
        lastBeat = t2;
    }
}

function doTick() {
    
}

// OSC.js stuff
const handleMessage = (msg) => {
    // Message type 1
    const msgParts = msg.address.split('/');
    if (msgParts[1] === 'buffer') {
        // slow
        console.log('loop change detected');
        loadBuffer(msgParts[2]);
    } 

    // Message type 2
    if (msgParts[1] === 'midi') {

        if (msgParts[2] === 'beat') {
            console.log('beat', ++beatCounter);
            // console.log('BEAT!');
        }

        if (msgParts[2] === 'tick') {
            // console.log('tick', ++tick);
            doBeat(tick);
        }
    }
}

const initOSC = () => {
    // Init container

    // Init port
    oscPort = new osc.WebSocketPort({
        url: "ws://localhost:8081"
    });


    // listen
    oscPort.on('message', (msg) => {
        handleMessage(msg); // Debugging
    });
    
    // open port
    oscPort.open();
};

// used later to start OSC
window.initOSC = initOSC();

// Additional code below

const getOutputs = async () => {
    if (WebMidi.enabled) {
        return WebMidi.outputs;
    } else {
        return [];
    }
}

// MIDI Testing
WebMidi.enable(function (err) {

  if (err) {
    console.log("WebMidi could not be enabled.", err);
  } else {
    console.log("WebMidi enabled!");
  }
  
});
