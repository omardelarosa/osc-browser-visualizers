// DATA container
let data = [];


// OSC.js stuff
const handleMessage = (msg) => {
    // console.log('MSG', msg);
    data = msg.address.split('/');
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

// P5 stuff -- or whatever library
let colSize = 0;
let rowSize = 0;
let lastDraw = 0;
const MAX_COLS = 16;
const MAX_ROWS = 8; 
const COLORS = [
    [255,204,0],
    [255,0,0],
    [0,255,0],
    [0,0,255]
]

function setup() { 
    createCanvas(windowWidth, windowHeight);
    colSize = windowWidth/MAX_COLS;
    rowSize = windowHeight/MAX_ROWS;
} 

function draw() { 
    if (data.length) {
        const [,,a,b,c] = data;
        const numA = Number(a); // col
        const numB = Number(b); // row
        const numC = Number(c); // color

        fill(...COLORS[numC]);
        rect(numA * colSize, numB * rowSize, colSize, rowSize);
        const now = millis();
        if (now - lastDraw > 100) {
            lastDraw = now;
            data = [];
        } 
    } else {
        clear();
    }
}
