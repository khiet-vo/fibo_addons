const { parentPort, workerData } = require('worker_threads');
const EventEmitter = require('events').EventEmitter;
const { callEmitFibo } = require('bindings')('addonsFibo');

const emitter = new EventEmitter();

emitter.on('start', () => {
    console.log('### START ...');
});
emitter.on('data', (evt) => {
    parentPort.postMessage(evt);
});
emitter.on('end', () => {
    console.log('🚀 ~ file: worker.js:15 ~ emitter.on ~ end:');
});

callEmitFibo(workerData, emitter.emit.bind(emitter));