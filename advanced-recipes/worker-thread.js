const { createServer } = require('http');
const { Worker } = require('node:worker_threads');

const worker = new Worker('./fibonacci-worker-thread.js');

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/fibonacci') {
    const number = JSON.parse(url.searchParams.get('number'));
    // we can create new worker for every request with const worker = new Worker(path-to-file, {num})
    // in worker module, we can get access to num by workerData.num. workerData is imported from node's worker_threads
    worker.postMessage({ number });
    worker.once('message', (msg) => {
      res.writeHead(200).end(`Fibonacci number: ${msg.result}`);
    });
  } else {
    res.writeHead(200).end('Status: OK!');
  }
}).listen(8000, () => console.log('Listening on port 8000...'));
