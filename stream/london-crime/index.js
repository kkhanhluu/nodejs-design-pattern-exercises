const { parse } = require('csv-parse');
const { createReadStream } = require('fs');
const { Transform, pipeline, Writable } = require('stream');
const asciichart = require('asciichart');

const parser = parse({ columns: true });

class FilterByYear extends Transform {
  constructor() {
    super({ objectMode: true });
    this.result = {};
  }

  _transform(record, encode, cb) {
    const { value, year } = record;
    if (this.result[year] == null) {
      this.result[year] = Number(value);
    } else {
      this.result[year] += Number(value);
    }
    cb();
  }

  _flush(cb) {
    this.push(this.result);
    cb();
  }
}

class FilterByBorough extends Transform {
  constructor() {
    super({ objectMode: true });
    this.result = {};
  }

  _transform(record, encoding, cb) {
    const { borough, value } = record;
    if (this.result[borough] == null) {
      this.result[borough] = Number(value);
    } else {
      this.result[borough] += Number(value);
    }
    cb();
  }
  _flush(cb) {
    this.push(JSON.stringify(this.result));
    cb();
  }
}

class DrawChart extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  _write(chunk, encoding, cb) {
    console.log(
      asciichart.plot(
        [
          738641, 717214, 715324, 724915, 737329, 686407, 680183, 711624,
          736121,
        ],
        { height: 20, colors: [asciichart.green] }
      )
    );
    cb();
  }
}

pipeline(
  createReadStream(`${__dirname}/london_crime_by_lsoa.csv`),
  parser,
  // new FilterByYear(),
  new FilterByBorough(),
  // new DrawChart(),
  process.stdout,
  (err) => {
    if (err) {
      console.log(JSON.stringify(err));
      throw new Error(err);
    }
    console.log('End');
  }
);
