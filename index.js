const osc = require('osc');
const express = require('express');
const WebSocket = require('ws');
const MidiClock = require('midi-clock')
const watch = require('node-watch');
const isEmpty = require('lodash/isEmpty');

let clock;
let clockIsRunning = false;
let fileChangesHashMap = {};

const getIPAddresses = () => {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    const ipAddresses = [];

    for (let deviceName in interfaces) {
        const addresses = interfaces[deviceName];
        for (let i = 0; i < addresses.length; i++) {
            const addressInfo = addresses[i];
            if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

const sendMIDIBeat = async (socket) => {
    socket.send({
        address: '/midi/clock',
    });
}

const readFileChanges = async (socket) => {
    if (isEmpty(fileChangesHashMap)) return;
    console.log('READING CHANGES', fileChangesHashMap);
    const packets = [];
    for (let f in fileChangesHashMap) {
        packets.push({
            address: `/buffer/${f}`,
        })
    }
    // Clearing map
    socket.send({
        timeTag: osc.timeTag(0),
        packets
    });

    fileChangesHashMap = {};
}

const stopClock = (c) => {
    if (clockIsRunning) {
        c.stop();
        clockIsRunning = false;
    }
};

const startClock = (c) => {
    if (!c) {
        clock = MidiClock();
        c = clock;
    }
    c.start();
    clockIsRunning = true;
}

// Bind to a UDP socket to listen for incoming OSC events.
const udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 57121
});

udpPort.on('ready', () => {
    var ipAddresses = getIPAddresses();
    console.log('Listening for OSC over UDP.');
    ipAddresses.forEach((address) => {
        console.log(' Host:', address + ', Port:', udpPort.options.localPort);
    });
    console.log('To start the demo, go to http://localhost:8081 in your web browser.');
});

udpPort.open();

// Create an Express-based Web Socket server to which OSC messages will be relayed.
const appResources = __dirname + '/public';
const nodeModules = __dirname + '/node_modules';
const app = express();
const server = app.listen(8081);
const wss = new WebSocket.Server({
        server: server
    });

app.use('/', express.static(appResources));
app.use('/node_modules/', express.static(nodeModules));
app.post('/startClock', (req, res) => {
    startClock(clock);
    res.send('ok!');
});

app.post('/stopClock', (req, res) => {
    stopClock(clock);
    res.send('ok!');
});

wss.on('connection', (socket) => {
    console.log('A Web Socket connection has been established!');
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    var relay = new osc.Relay(udpPort, socketPort, {
        raw: true
    });
    startClock(clock);

    const beatCallback = (position) => {
        const microPos = position % 24; // 24 ticks per event 
        if (microPos === 0) {
            console.log('Beat: ', position / 24);
            // TODO: better handle closing of browser tabs
            sendMIDIBeat(socketPort).catch((e) => unbindCallback());
            readFileChanges(socketPort).catch((e) => unbindCallback());
        }
    };

    const unbindCallback = () => {
        clock.removeListener('position', beatCallback);
    }

    clock.on('position', beatCallback);
});

watch('./public/_buffers', { recursive: false }, (evt, name) => {
    const [,,bufferName] = name.split('/');
    console.log('%s changed.', bufferName);
    fileChangesHashMap[bufferName] = true;
});
