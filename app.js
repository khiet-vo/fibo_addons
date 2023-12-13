const express = require('express');
const cors = require('cors');
const port = 3001;
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const clientURL = 'http://localhost:3000';

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
    console.log('🚀 ~ file: app.js:32 ~ io.on ~ socket.id:', socket.id);
    socket.on('sendNumber', (data) => {
        console.log('🚀 ~ file: app.js:33 ~ socket.on ~ data:', data);
        io.to(socket.id).emit('receive_number', { value: 'got it!!' });
    });
});
