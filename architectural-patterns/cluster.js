const { createServer } = require('http');
const cluster = require('node:cluster');
const { cpus } = require('node:os');

if (cluster.isPrimary) {
  const availableCPUS = cpus();
  availableCPUS.forEach(() => cluster.fork());

  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(
        `Worker ${worker.process.pid} crushed. Starting a new worker`
      );
      cluster.fork();
    }
  });
} else {
  const { pid } = process;
  createServer((req, res) => {
    let i = 1e7;
    while (i > 0) {
      i--;
    }
    console.log(`Handling request from ${pid}`);
    res.end(`Hello from ${pid}\n`);
  }).listen(8000, () => console.log(`Started at ${pid}`));

  setTimeout(() => {
    throw new Error('Unexpected error');
  }, Math.ceil(Math.random() * 3) * 1000);
}
