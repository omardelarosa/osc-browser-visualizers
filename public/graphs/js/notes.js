var nodes = null;
var edges = null;
var network = null;
var selectedNodeId = 1;

var NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

var G = {
    '0': [1, 1, 0, 3, 4, 5, 6],
    '1': [0, 0, 2, 3],
    '2': [1, 3, 4],
    '3': [4],
    '4': [5],
    '5': [5, 4, 1, 0],
    '6': [2, 2, 2, 3, 3],
};

var MC = new MarkovChain(G, NOTES, 0);

// create an array with nodes
function makeNodes(obj, labels) {
    var nodeStyle = {
        font: {
            color: '#000000',
            face: 'sans-serif',
            size: 20,
        },
        color: {
            highlight: {
                border: '#ccfa99',
                background: '#faf099',
            },
        },
    };
    const ids = Object.keys(obj).map(Number);
    return ids.map(id => {
        return {
            id,
            value: obj[id].length, // how many edges
            label: labels[id],
            ...nodeStyle,
        };
    });
}

function makeEdges(obj) {
    const edgeOptions = {
        arrows: {
            to: {
                enabled: true,
            },
        },
        color: {
            highlight: '#99f9fa',
        },
    };

    const ids = Object.keys(obj).map(Number);
    const edges = [];

    // Make matrix
    ids.forEach(id => {
        let values = {};
        obj[id].forEach(edge => {
            if (!values[edge]) {
                values[edge] = 1;
            } else {
                values[edge] += 1;
            }
        });

        Object.keys(values).forEach(k => {
            edges.push({
                from: id,
                to: Number(k),
                value: values[k],
                ...edgeOptions,
            });
        });
    });

    return edges;
}

function draw() {
    nodes = makeNodes(G, NOTES);

    edges = makeEdges(G);

    // create a network
    var container = document.getElementById('graph');
    var data = {
        nodes: nodes,
        edges: edges,
    };
    var options = {
        nodes: {
            shape: 'dot',
            size: 10,
        },
    };
    network = new vis.Network(container, data, options);
}

draw();

network.fit(nodes.map(n => n.id));

network.selectNodes([MC.peekID()]);

setInterval(() => {
    selectedNodeId = MC.nextID();
    network.selectNodes([selectedNodeId]);
}, 1000);
