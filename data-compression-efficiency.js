const { createReadStream, createWriteStream } = require('fs');
const { hrtime } = require('process');
const { PassThrough } = require('stream');

class Profiler {
  constructor(label) {
    this.label = label;
  }
  start() {
    this.startTime = hrtime.bigint();
  }

  end() {
    const endTime = hrtime.bigint();
    const diffTime = endTime - this.startTime;
    console.log(`${this.label} took ${diffTime}`);
  }
}

const sourcePath = process.arv[2];
const destinationPath = process.argv[3];

function measureCompression(label, algorithm) {
  const size = 0;
  const readStream = createReadStream(sourcePath);
  const compressStream = algorithm();
  const monitorSize = new PassThrough();
  monitorSize.on('data', (chunk) => (size += chunk.length));
  monitorSize.on('end', () => console.log(`${size} bytes are written`));
  const writeStream = createWriteStream(destinationPath);

  const profiler = new Profiler();
}
