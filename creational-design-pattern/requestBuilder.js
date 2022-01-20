const http = require('http');
class RequestBuilder {
  setMethod(method) {
    this.method = method;
    return this;
  }
  setURL(protocol, hostname) {
    this.protocol = protocol;
    this.hostname = hostname;
    return this;
  }
  setPath(path, queryObject) {
    const queryString =
      queryObject != null
        ? Object.entries(queryObject)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        : '';
    const p = `/${path}${queryString.length > 0 ? `?${queryString}` : ''}`;
    this.path = p;
    return this;
  }
  setHeaders(headers) {
    this.headers = headers;
    return this;
  }
  setBody(body) {
    this.body = body;
    return this;
  }
  invoke(cb) {
    return http.request(
      {
        method: this.method,
        protocol: this.protocol,
        hostname: this.hostname,
        path: this.path,
        headers: this.headers,
        body: this.body,
      },
      cb
    );
  }
}

const req = new RequestBuilder()
  .setMethod('GET')
  .setURL('http:', 'jsonplaceholder.typicode.com')
  .setPath('todos/1')
  .setHeaders({ 'Content-type': 'application/json' })
  .invoke((res) => {
    console.log(res.statusCode);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => console.log('No more data'));
    res.on('error', (err) => console.log(err));
  });

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

console.log(req.method, req.protocol, req.host, req.path);
req.end();
