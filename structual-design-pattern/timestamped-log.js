const logger = new Proxy(console, {
  get(target, property) {
    if (
      property === 'log' ||
      property === 'error' ||
      property === 'debug' ||
      property === 'info'
    ) {
      return function (...args) {
        return target[property](new Date().toISOString(), ...args);
      };
    }
  },
});

logger.log('hello');
logger.error('world');
