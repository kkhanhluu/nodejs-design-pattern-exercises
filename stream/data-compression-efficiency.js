const { createReadStream, createWriteStream } = require('fs');
const { hrtime } = require('process');
const { PassThrough, pipeline } = require('stream');
const { createBrotliCompress, createGzip, createDeflate } = require('zlib');

class Profiler {
  constructor(label) {
    this.label = `${label} took`;
  }
  start() {
    console.time(this.label);
  }

  end() {
    console.timeEnd(this.label);
  }
}

const sourcePath = './enwik8.pmd';
const destinationPath = './output';

function measureCompression(label, algorithm) {
  let size = 0;
  const readStream = createReadStream(sourcePath);
  const compressStream = algorithm();
  const monitorSize = new PassThrough();
  monitorSize.on('data', (chunk) => (size += chunk.length));
  monitorSize.on('end', () => {
    console.log('====================================');
    console.log(`${size} bytes are written`);
  });
  const writeStream = createWriteStream(`${destinationPath}-${label}.txt`);

  const profiler = new Profiler(label);
  profiler.start();
  pipeline(readStream, monitorSize, compressStream, writeStream, (e) => {
    if (e) throw e;
    profiler.end();
  });
}

const algorithms = [
  { label: 'Brotli', algorithm: createBrotliCompress },
  { label: 'Deflate', algorithm: createDeflate },
  { label: 'Gzip', algorithm: createGzip },
];

algorithms.forEach(({ label, algorithm }) =>
  measureCompression(label, algorithm)
);
