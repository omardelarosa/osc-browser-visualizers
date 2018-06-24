var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

function loop() {
    console.log('Noop beat.');
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
    const $buffer = document.createElement('script');
    const ts = Date.now();
    $buffer.src = `/_buffers/${b}?${ts}`;
    $buffer.className = 'buffer-script';
    document.body.appendChild($buffer);
}

// DATA container
let data = [];


// OSC.js stuff
const handleMessage = (msg) => {
    const msgParts = msg.address.split('/');
    if (msgParts[1] === 'buffer') {
        console.log('loop change detected');
        loadBuffer(msgParts[2]);
    }

    if (msgParts[1] === 'midi') {
        loop();
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
