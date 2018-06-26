var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

// Custom event dispatcher
function Dispatcher(options) {
    // TODO: do this without a DOM using EventEmitter
    const target = document.createTextNode(null);

    this.addEventListener = target.addEventListener.bind(target);
    this.removeEventListener = target.removeEventListener.bind(target);
    this.dispatchEvent = target.dispatchEvent.bind(target);

    // Other constructor stuff...
}

let dispatcher = new Dispatcher();

const handleTick = (ev) => {
    const sequenceId = ev.detail.sequenceId;
    // console.log('Sequence ID', sequenceId);
    doBeat(sequenceId);
}

const handleBeat = (ev) => {
    const sequenceId = ev.detail.sequenceId;
    console.log('Beat Sequence ID', sequenceId);
    drainRegisterLoopQueue();
}

dispatcher.addEventListener('tick', handleTick);
dispatcher.addEventListener('beat', handleBeat);

let tick = 0;
let T = 24; // Ticks in beat
let sleeps = 0;

// TODO: make this flag "scoped" to each loop
let loops = {};

class Loop {
    constructor({ handler, name }) {
        this.isSleeping = false;
        this.lastTickCalled = -1;
        this.handler = handler;
        this.name = name;
        this.ticksToSleep = -1;
        // TODO: add clean up logic
        this.isDead = false;
    }

    sleep(amount) {
        this.ticksToSleep = amount;
        this.isSleeping = true;
        return new Promise((resolve, reject) => {

        });
    }

    destroy() {
        this.isDead = true;
        this.handler = null;
    }

    run() {
        // Decrementer must be at the begging to account for 0th tick in sleep cycle
        this.ticksToSleep--;
        if (this.ticksToSleep <= 0) {
          this.isSleeping = false;
        }

        // Only call if not sleeping, not dead and has not been called this tick
        if (!this.isSleeping && !this.isDead && this.lastTickCalled !== tick) {
            this.lastTickCalled = tick;
            this.handler(this);
        }
    }
}

const newLoopsQueue = [];

const drainRegisterLoopQueue = () => {
    while (newLoopsQueue.length > 0) {
        const { name, handler } = newLoopsQueue.pop();
        // Cleanup if exists
        if (loops[name]) {
            const oldLoop = loops[name];
            oldLoop.destroy();
            delete loops[name];
        }
        loops[name] = new Loop({ name, handler });
    }
};

// Registers loops
function loop(name, handler) {
    // Queue them up to be updated on the beat
    newLoopsQueue.push({ name, handler });
}

// TODO: make sleep scoped to each loop
// TODO: break this out into a primitive operation
const sleep = (ticks) => new Promise(
);

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
    // Cancel any pending loop invokations
}

const processLoops = (t) => {
    const start = Date.now();
    // Limit duration of this invokation with timeout to preserve time
    Object.keys(loops).forEach((loopName) => {
        loops[loopName].run();
    });
    // console.log('process time: ', Date.now() - start);
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
        processLoops(t2);
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
            setTimeout(() => processLoops(beat), deltaDiff * -1);
        } else {
            // behind time... TODO:
            processLoops(beat);
        }
        lastBeat = t2;
    }
}

function doTick() {
    
}


// TODO: create central event dispatcher

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
            beatCounter++;
            // console.log('beat', ++beatCounter);
            const evt = new CustomEvent('beat', { detail: { sequenceId: beatCounter } });
            dispatcher.dispatchEvent(evt);
        }

        if (msgParts[2] === 'tick') {
            const evt = new CustomEvent('tick', { detail: { sequenceId: ++tick } });
            dispatcher.dispatchEvent(evt);
            // console.log('tick', ++tick);
            // doBeat(tick);
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

const getOutputs = () => {
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
