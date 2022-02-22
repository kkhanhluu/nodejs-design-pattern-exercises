const EventEmitter = require('events');
const { createServer } = require('http');

// nextTick() cannot be used to interleaved a long-running task. nextTick() schedules a task to run before any pending I/O
function fibonacciInterleaved(n, cb) {
  if (n < 3) {
    // setImmediate(cb, 1);
    cb(1);
    return;
  }

  let sum = 0;
  function end(subN) {
    if (sum !== 0) {
      // setImmediate(cb, subN + sum);
      cb(subN + sum);
    } else {
      sum += subN;
    }
  }
  // setImmediate(fibonacciInterleaved, n - 1, end);
  // setImmediate(fibonacciInterleaved, n - 2, end);
  fibonacciInterleaved(n - 1, end);
  fibonacciInterleaved(n - 2, end);
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/fibonacci') {
    res.writeHead(200);
    return res.end('Status: OK!');
  }
  const number = JSON.parse(url.searchParams.get('number'));
  res.writeHead(200);
  fibonacciInterleaved(number, (value) => {
    res.end(value.toString());
  });
}).listen(8000, () => console.log('Listening on port 8000...'));
