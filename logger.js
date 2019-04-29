import winston from "winston";
const { combine, timestamp, printf, colorize } = winston.format;
const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});
export const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: combine(timestamp(), colorize(), myFormat)
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: combine(timestamp(), myFormat)
    }),
    new winston.transports.File({
      filename: "combined.log",
      format: combine(timestamp(), myFormat)
    })
  ]
});
