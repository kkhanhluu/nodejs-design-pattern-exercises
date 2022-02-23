const { createServer } = require('node:http');
const axios = require('axios');

const queue = new Map();

function getData() {
  return axios.get(
    'https://raw.githubusercontent.com/json-iterator/test-data/master/large-file.json'
  );
}

function handler(key) {
  if (queue.has(key)) {
    console.log('Batching');
    return queue.get(key);
  }
  const resultPromise = getData();
  queue.set(key, resultPromise);

  resultPromise.finally(() => {
    queue.delete(key);
  });

  return resultPromise;
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/fibonacci') {
    res.writeHead(200);
    return res.end('Status: OK!');
  }
  const number = JSON.parse(url.searchParams.get('number'));
  //   handler(number).then(() => {
  //     res.writeHead(200);
  //     res.end(`Success with key: ${number}`);
  //   });
  getData().then(() => {
    res.writeHead(200);
    res.end(`Success with key: ${number}`);
  });
}).listen(8000, () => console.log('Listening on port 8000...'));
