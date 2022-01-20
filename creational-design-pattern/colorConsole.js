class ColorConsole {
  log() {}
}

class RedConsole {
  log(input) {
    console.log('\x1b[31m', input);
  }
}
class BlueConsole {
  log(input) {
    console.log('\x1b[34m', input);
  }
}
class GreenConsole {
  log(input) {
    console.log('\x1b[32m', input);
  }
}

function consoleFactory(color) {
  switch (color) {
    case 'red':
      return new RedConsole();
    case 'blue':
      return new BlueConsole();
    case 'green':
      return new GreenConsole();
    default:
      return new ColorConsole();
  }
}

consoleFactory('red').log('Hello world');
consoleFactory('green').log('Hello world');
consoleFactory('blue').log('Hello world');
