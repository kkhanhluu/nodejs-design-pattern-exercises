const { createWriteStream } = require('fs');
const net = require('net');
const { join } = require('path');

let writeStream;
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    if (writeStream == null) {
      writeStream = createWriteStream(join(__dirname, data.toString()));
      console.log(`Started receiving file: ${data.toString()}`);
      writeStream.on('close', () => console.log(`Finish writing files`));
      return;
    }
    writeStream.write(data);
  });

  socket.on('close', () => {
    writeStream.destroy();
    writeStream = null;
  });
});

server.listen(3000, () => console.log('server is listening on port 3000'));
