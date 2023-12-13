const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { Worker } = require('worker_threads');

const clientURL = 'http://localhost:3000';
const port = 3001;
const LIMIT_NUMBER = process.env.LIMIT_NUMBER || 100000;

const app = express();

// Middleware
app.use(bodyParser.json({ type: 'application/json' }));

// Routes
app.get('/', (_req, res) => {
    console.info('Homepage:' + port);
    res.send('Hello world!!!');
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
    worker.on('exit', (code) => {
        console.log('🚀 ~ file: app.js:97 ~ worker.on ~ code:', code);
        setTimeout(() => {
            io.to(socketId).emit('receive_number', { isFinished: true });
        }, 1000);
    });
}
