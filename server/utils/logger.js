const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel =
  LEVELS[process.env.LOG_LEVEL] ?? (process.env.NODE_ENV === 'production' ? LEVELS.warn : LEVELS.info);

function write(level, args) {
  if (LEVELS[level] <= currentLevel) {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](
      `[${new Date().toISOString()}] [${level.toUpperCase()}]`,
      ...args,
    );
  }
}

export const logger = {
  error: (...args) => write('error', args),
  warn: (...args) => write('warn', args),
  info: (...args) => write('info', args),
  debug: (...args) => write('debug', args),
};
