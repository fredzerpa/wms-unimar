const path = require('path');
const responseTime = require('response-time');
const { format, createLogger, transports } = require("winston");
const { timestamp, combine, errors, colorize, printf } = format;
require('winston-daily-rotate-file');

const buildProdLogger = () => {
  const transport = new transports.DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(__dirname, '..', 'logs'),
    filename: 'access-%DATE%.log',
    zippedArchive: true,
    maxFiles: '180d',
  });

  const logger = createLogger({
    level: 'info',
    format: combine(
      timestamp(),
      errors({ stack: true }),
      format.prettyPrint(),
    ),
    defaultMeta: { service: 'arcadat-conecta' },
    transports: [transport],
  });


  return logger;
}

const buildDevLogger = () => {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  });

  const logger = createLogger({
    level: 'debug',
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat,
    ),
    transports: [new transports.Console()],
  });

  return logger;
}

// A middleware for logging all actions received by the API
const registerLog = (logger) => (req, res, next) => {
  const { ip, hostname, method, url, params, body, query } = req;
  const { statusCode } = res;

  // Get the token
  const bearer = req.headers?.authorization;
  const token = bearer?.split(' ')[1];

  responseTime((req, res, time) => {
    // Set format to logs
    const logData = {
      ip,
      hostname,
      method,
      url,
      statusCode,
      params,
      body,
      query,
      responseTime: Math.round(time),
      token,
    };

    logger.info(logData);
  })(req, res, next);
  // ! we do not use next here as the responseTime is a middleware which will use next() for us.
}

let logger = null;
if (process.env.NODE_ENV === 'development') {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

module.exports = {
  logger,
  registerLog: registerLog(logger),
};