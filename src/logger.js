import { format, createLogger, transports } from 'winston';
import morgan from 'morgan';
// import morganBody from 'morgan-body';

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
  debugFile: {
    level: 'debug',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    colorize: false,
    json: true,
    format: format.combine(format.timestamp(), format.json()),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    handleRejections: true,
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
      { handleRejections: true },
    ),
    new transports.File({
      ...options.file,
      filename: 'logs/app.log',
    }),
    new transports.File({
      ...options.debugFile,
      filename: 'logs/debug.log',
    }),
  ],
});

logger.stream = {
  write: (message) => logger.info(message),
};

logger.debugStream = {
  write: (message) => logger.debug(message),
  // {
  //   let msg;
  // if (typeof message === 'string') {
  //   // with morgan-body
  //   // if appended with ':', these are string, not json
  //   console.log('before', message, 'ddddddddddddxxxxxxxxxxxxxxx', msg);
  //   if (message.includes('Request:') || message.includes('Response:')) {
  //     msg = message;
  //     console.log('includes', message, 'ddddddddddddxxxxxxxxxxxxxxx', msg);
  //   } else if (message.includes('')) {
  //     console.log(
  //       'doesnt include',
  //       message,
  //       'ddddddddddddxxxxxxxxxxxxxxx',
  //       msg,
  //     );
  //     msg = JSON.parse('{' + message + '}');
  //   }
  // } else {
  //   msg = message;
  // }
  // msg = message;

  // return logger.debug(msg);
  // },
};

logger.middleware = () => morgan('combined', { stream: logger.stream });

// logger.getBody = (app, options = {}) => {
//   morganBody(app, {
//     noColors: true,
//     prettify: false,
//     includeNewLine: false,
//     // logReqDateTime: false,
//     // logReqUserAgent: false,
//     // logIP: false,
//     immediateReqLog: false,
//     stream: logger.debugStream,
//     ...options,
//   });
// };

// https://stackoverflow.com/a/60817116
logger.bodyMiddleware = (req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    // do something with the data
    // console.log(data);
    // console.log(typeof data)
    let logData;
    try {
      logData = JSON.parse(data);
    } catch {
      logData = data;
    }
    logger.debug({
      requestBody: req.body,
      responseBody: logData,
    });
    res.send = oldSend; // set function back to avoid the 'double-send'
    return res.send(data); // just call as normal with data
  };
  next();
};

const nodeEnv = process.env.NODE_ENV;
if (nodeEnv !== 'production' && nodeEnv !== 'test') {
  logger.add(new transports.Console(options.console));
}

export default logger;
