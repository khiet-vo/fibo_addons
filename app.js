const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { Server } = require('socket.io');
const { Worker } = require('worker_threads');

const clientURL = 'http://localhost:3000';
const port = 3001;
const LIMIT_NUMBER = process.env.LIMIT_NUMBER || 1_000_000;

const app = express();

// Middleware
app.use(bodyParser.json({ type: 'application/json' }));

// Routes
app.use(express.static(path.resolve(__dirname, './public')));
app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});


const server = app.listen(port, () => {
    console.log('Fibo App running on port:' + port);
});

//  setup SocketIO from server
const io = new Server(server, {
    cors: {
        origin: clientURL,
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    socket.on('sendNumber', (data) => {
        runWorker(data.value, socket.id);
    });
});
function runWorker(number, socketId) {
    try {
        number = parseInt(number);
    } catch {
        io.to(socketId).emit('receive_number', {
            error: 'please use number',
        });
        return;
    }
    if (number > LIMIT_NUMBER) {
        io.to(socketId).emit('receive_number', {
            error: `Cannot process number bigger ${LIMIT_NUMBER} - it will cost a lot of time`,
        });
        return;
    }
    const worker = new Worker('./worker.js', { workerData: number });
    worker.on('message', (result) => {
        io.to(socketId).emit('receive_number', { value: result });
    });
    worker.on('error', (error) => console.error(`Worker error: ${error}`));
    worker.on('exit', (code) => {
        console.log('🚀 ~ file: app.js:97 ~ worker.on ~ code:', code);
        io.to(socketId).emit('receive_number', { isFinished: true });
    });
}
