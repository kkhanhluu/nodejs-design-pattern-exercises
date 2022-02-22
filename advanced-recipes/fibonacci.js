function fibonacci(n) {
  if (n < 3) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

process.on('message', (msg) => {
  if (msg.event === 'START') {
    const number = fibonacci(msg.number);
    process.send({ event: 'END', result: number });
  }
});
