const { Worker } = require('worker_threads');

const emitSSE = (res, number) => {
    res.write('id: ' + new Date().getTime() + '\n');
    res.write('data: ' + number + '\n\n');
};
const writeSuccess = (res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });
};
const handleSSE = (req, res) => {
    let { number } = req.params;
    try {
        number = parseInt(number);
    } catch (error) {
        console.error(error);
    }
    console.log('🚀 ~ file: sse.js:36 ~ workerSSE.Start ~ start:');

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });
    const worker = new Worker('./workerSSE.js', { workerData: number });
    worker.on('message', (result) => {
        // io.to(socketId).emit('receive_number', { value: result });
        emitSSE(res, result);
    });
    worker.on('error', (error) => console.error(`Worker error: ${error}`));
    worker.on('exit', (code) => {
        // io.to(socketId).emit('receive_number', { isFinished: true });
        console.log('🚀 ~ file: sse.js:36 ~ workerSSE.on ~ exit:', code);

        emitSSE(res, 'finished');
    });
    // emitSSE(res, id, new Date().toLocaleTimeString());
};
module.exports = { handleSSE };
