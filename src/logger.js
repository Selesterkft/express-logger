import { format, createLogger, transports } from 'winston';
import morgan from 'morgan';

const options = {
  file: {
    level: 'info',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    json: true,
    format: format.combine(format.timestamp(), format.json()),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    format: format.combine(format.colorize(), format.simple()),
  },
};

const logger = createLogger({
  exitOnError: false,
  handleRejections: true,
  transports: [
    Object.assign(
      new transports.File({
        ...options.file,
        filename: 'logs/error.log',
        level: 'error',
      }),
      { handleRejections: true }
    ),
    new transports.File({
      ...options.file,
      filename: 'logs/app.log',
    }),
  ],
});

logger.stream = {
  write: (message) => logger.info(message),
};

logger.middleware = () => morgan('combined', { stream: logger.stream });

const nodeEnv = process.env.NODE_ENV;
if (nodeEnv !== 'production' && nodeEnv !== 'test') {
  logger.add(
    Object.assign(new transports.Console(options.console), {
      handleRejections: true,
    })
  );
}

export default logger;
