const { parentPort } = require('node:worker_threads');
function fibonacci(n) {
  if (n < 3) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

parentPort.on('message', (data) => {
  parentPort.postMessage(fibonacci(data.number));
});
