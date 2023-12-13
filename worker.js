const { parentPort, workerData } = require('worker_threads');
const { hello } = require('bindings')('addonsFibo');
console.log('🚀 ~ file: worker.js:3 ~ addonsFibo:', hello());
parentPort.postMessage('workerdata' + workerData);
