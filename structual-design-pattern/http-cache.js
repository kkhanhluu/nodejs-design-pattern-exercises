const axios = require('axios');

class HttpClient {
  constructor() {
    const cache = new Map();
    const httpClientHandler = {
      get(target, property) {
        console.log('cache', cache);
        if (property === 'get') {
          return async (url, ...args) => {
            if (cache.get(url) == null) {
              const { data } = await target.get(url, ...args);
              cache.set(url, data);
              console.log('return from network');
              return data;
            }
            console.log('returned from cache');
            return cache.get(url);
          };
        }
        return target[property];
      },
    };
    return new Proxy(axios, httpClientHandler);
  }
}

const client = new HttpClient();
client
  .get('https://jsonplaceholder.typicode.com/todos/1')
  .then((res) => console.log(res));
setTimeout(() => {
  client
    .get('https://jsonplaceholder.typicode.com/todos/1')
    .then((res) => console.log(res));
}, 3000);

setTimeout(() => {
  client
    .get('https://jsonplaceholder.typicode.com/todos/1')
    .then((res) => console.log(res));
}, 6000);
