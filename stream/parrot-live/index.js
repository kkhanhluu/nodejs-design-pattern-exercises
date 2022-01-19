const { createReadStream, readFileSync } = require('fs');
const http = require('http');
const { pipeline, Readable } = require('stream');

const totalFrames = 10;
let currentFrame = 0;

const server = http.createServer((req, res) => {
  if (
    req.headers &&
    req.headers['user-agent'] &&
    !req.headers['user-agent'].includes('curl')
  ) {
    res.statusCode(404);
    res.write('You have to send request with curl');
    return res.end();
  }

  const readStream = new Readable({
    read() {},
  });

  const interval = setInterval(() => {
    currentFrame = (currentFrame % 4) + 4;
    const frame = readFileSync(`${__dirname}/frames/f${currentFrame}.txt`);
    readStream.push('\033[2J');
    readStream.push(frame);
    currentFrame++;
  }, 500);

  pipeline(readStream, res, (err) => console.log(err));

  req.on('close', () => {
    console.log('Closed');
    res.write('End');
    res.end();
    clearInterval(interval);
  });
});

server.listen(3000, () => console.log('Listen on port 3000'));
