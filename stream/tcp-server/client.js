const { createReadStream } = require('fs');
const net = require('net');
const { pipeline } = require('stream');

const client = net.createConnection({ port: 3000 }, () => {
  console.log('connected to port 3000');
});

const fileName = `photo.jpeg`;
client.on('connect', () => {
  client.write('photo-out.jpeg');
  pipeline(createReadStream(`${__dirname}/photo.jpeg`), client, (err) => {
    if (err) {
      console.log(err);
    }
    client.destroy();
  });
});
