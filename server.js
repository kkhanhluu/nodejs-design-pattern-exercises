const EventEmitter = require('events');
const { createServer } = require('http');

class Fibonacci extends EventEmitter {
  fibonacci(n) {
    if (n === 0 || n === 1) {
      return 1;
    }
    this.fibonacciInterleaved(n - 1);
    this.fibonacciInterleaved(n - 2);
    this.on('endFib', console.log);
  }

  fibonacciInterleaved(n) {
    let num1;
    setImmediate(() => {
      this.fibonacci(n);
      this.emit('endFib');
    });
  }
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/fibonacci') {
    res.writeHead(200);
    return res.end('Status: OK!');
  }
  const number = JSON.parse(url.searchParams.get('number'));
  res.writeHead(200);
  const fib = new Fibonacci();
  fib.on('end', (value) => res.end(value.toString()));
  fib.fibonacciInterleaved(number);
}).listen(8000, () => console.log('Listening on port 8000...'));
