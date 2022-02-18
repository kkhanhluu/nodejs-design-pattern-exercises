import styles from 'ansi-styles';

const coloredLogger = console;
Reflect.set(coloredLogger, 'red', function (...args) {
  console.log(styles.red.open, ...args, styles.red.close);
});

Reflect.set(coloredLogger, 'green', function (...args) {
  console.log(
    styles.bgGreen.open,
    styles.black.open,
    ...args,
    styles.black.close,
    styles.bgGreen.close
  );
});

coloredLogger.red('Hello world');
coloredLogger.green('Hello world');
