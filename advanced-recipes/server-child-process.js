const { createServer } = require('http');
const { fork } = require('node:child_process');
const { readFile } = require('node:fs');

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/fibonacci') {
    const forked = fork('advanced-recipes/fibonacci.js');
    const number = JSON.parse(url.searchParams.get('number'));
    forked.send({ event: 'START', number });
    forked.on('message', (msg) => {
      if (msg.event === 'END') {
        res.writeHead(200).end(`Fibonacci number: ${msg.result}`);
      }
    });
  } else {
    res.writeHead(200).end('Status: OK!');
  }
}).listen(8000, () => console.log('Listening on port 8000...'));
