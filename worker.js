const { parentPort, workerData } = require('worker_threads');

parentPort.postMessage('workerdata' + workerData);
